const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const { generateTokens } = require('../utils/jwt');

const register = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { first_name, last_name, email, phone, password, salt, ip_address, device_info } = req.body;
    
    await connection.beginTransaction();
    
    const [existingUser] = await connection.query(
      'SELECT email FROM users WHERE email = ?', 
      [email]
    );
    
    if (existingUser.length > 0) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await connection.query(
      'INSERT INTO users (first_name, last_name, email, phone, password, encryption_salt, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, hashedPassword, salt, 'customer', 'active']
    );

    if (ip_address) {
      await connection.query(
        'INSERT INTO users_ip (user_id, ip_address, login_timestamp, device_info) VALUES (?, ?, NOW(), ?)',
        [result.insertId, ip_address, device_info || null]
      );
    }

    await connection.commit();
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        message: 'Registration successful'
      }
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const login = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const { email, password, ip_address, device_info } = req.body;
        
        if (!email) {
            throw new Error('Email is required');
        }
        
        if (!password) {
            throw new Error('Password is required');
        }
        
        await connection.beginTransaction();
        
        const [users] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        const user = users[0];
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        const passwordMatches = await bcrypt.compare(password, user.password);
        
        if (!passwordMatches) {
            throw new Error('Invalid email or password');
        }

        const { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = generateTokens(user);
        
        await connection.query(
            'INSERT INTO user_tokens (user_id, access_token, refresh_token, access_expires_at, refresh_expires_at) VALUES (?, ?, ?, ?, ?)',
            [user.user_id, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt]
        );

        if (ip_address) {
            await connection.query(
                'INSERT INTO users_ip (user_id, ip_address, login_timestamp, device_info) VALUES (?, ?, NOW(), ?)',
                [user.user_id, ip_address, device_info || null]
            );
        }

        await connection.commit();
        
        res.json({
            status: 'success',
            data: {
                tokens: {
                    access: accessToken,
                    refresh: refreshToken,
                    accessExpiresAt,
                    refreshExpiresAt
                },
                user: {
                    id: user.user_id,
                    phone: user.phone,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                }
            }
        });

    } catch (error) {
        await connection.rollback();
        if (error.message === 'Invalid email or password') {
            res.status(401).json({
                status: 'error',
                message: error.message
            });
        } else {
            next(error);
        }
    } finally {
        connection.release();
    }
};

const requestPasswordReset = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { email } = req.body;
    if (!email) throw new Error('Please enter your email address.');
    
    await connection.beginTransaction();
    
    const [users] = await connection.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      throw new Error('Email not found in our system.');
    }
    
    const userId = users[0].user_id;
    
    const [existingResets] = await connection.query(
      `SELECT token, verification_code, TIMESTAMPDIFF(MINUTE, NOW(), expiry) as minutes_remaining 
       FROM password_resets 
       WHERE user_id = ? AND used = 0 AND expiry > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    
    if (existingResets.length > 0) {
      const reset = existingResets[0];
      return res.json({
        status: 'success',
        message: `A verification code has already been sent to your email. It will expire in ${reset.minutes_remaining} minutes.`,
        step: 'verification_sent',
        token: reset.token
      });
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 15 * 60000);
    
    await connection.query(
      'INSERT INTO password_resets (user_id, token, verification_code, expiry, used) VALUES (?, ?, ?, ?, 0)',
      [userId, token, verificationCode, expiry]
    );
    
    const transporter = nodemailer.createTransport({
      host: 'mail.centrium.id',
      port: 465,
      secure: true,
      auth: {
        user: 'michael@centrium.id',
        pass: 'Centrium.2025'
      }
    });
    
    const resetLink = `https://crm.centrium.id/account/verify-reset?token=${token}`;
    
    const mailOptions = {
      from: '"Centrium Admin" <michael@centrium.id>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <p>
                <a href="${resetLink}" 
                   style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
                    Reset Password
                </a>
            </p>
            <p>When prompted, use this verification code:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
                <strong>${verificationCode}</strong>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Alternatively, you can copy and paste this link in your browser:</p>
            <p>${resetLink}</p>
        </body>
        </html>
      `,
      text: `Reset your password using this link:\n${resetLink}\n\nVerification code: ${verificationCode}\n\nThis code will expire in 15 minutes.`
    };
    
    await transporter.sendMail(mailOptions);
    await connection.commit();
    
    res.json({
      status: 'success',
      message: 'Password reset instructions have been sent to your email.',
      step: 'verification_sent',
      token: token
    });
    
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const verifyCode = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { token, code } = req.body;
    
    if (!token || !code) {
      throw new Error('Token and verification code are required.');
    }

    const [resets] = await connection.query(
      `SELECT * FROM password_resets 
       WHERE token = ? 
       AND verification_code = ? 
       AND used = 0 
       AND expiry > NOW()
       LIMIT 1`,
      [token, code]
    );

    if (resets.length === 0) {
      throw new Error('Invalid or expired verification code.');
    }

    await connection.query(
      'UPDATE password_resets SET verified_at = NOW() WHERE id = ?',
      [resets[0].id]
    );

    await connection.commit();

    res.json({
      status: 'success',
      message: 'Code verified successfully',
      token,
      code
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const resetPassword = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { token, code, password } = req.body;
    
    if (!token || !code || !password) {
      throw new Error('All fields are required.');
    }

    await connection.beginTransaction();

    const [resets] = await connection.query(
      `SELECT pr.*, u.user_id 
       FROM password_resets pr 
       INNER JOIN users u ON pr.user_id = u.user_id 
       WHERE pr.token = ? 
       AND pr.verification_code = ? 
       AND pr.used = 0 
       AND pr.verified_at IS NOT NULL
       AND pr.expiry > NOW()
       LIMIT 1`,
      [token, code]
    );

    if (resets.length === 0) {
      throw new Error('Invalid or expired reset request.');
    }

    const reset = resets[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, reset.user_id]
    );

    await connection.query(
      'UPDATE password_resets SET used = 1, used_at = NOW() WHERE id = ?',
      [reset.id]
    );

    await connection.commit();

    res.json({
      status: 'success',
      message: 'Password has been reset successfully.'
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const refreshToken = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        const { refresh_token } = req.body;
        
        if (!refresh_token) {
            throw new Error('Refresh token is required');
        }

        const [tokens] = await connection.query(
            'SELECT * FROM user_tokens WHERE refresh_token = ? AND refresh_expires_at > NOW()',
            [refresh_token]
        );

        if (tokens.length === 0) {
            throw new Error('Invalid or expired refresh token');
        }

        const [users] = await connection.query(
            'SELECT * FROM users WHERE user_id = ?',
            [tokens[0].user_id]
        );

        const user = users[0];
        
        const { 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken,
            accessExpiresAt,
            refreshExpiresAt
        } = generateTokens(user);

        await connection.beginTransaction();

        await connection.query(
            `UPDATE user_tokens 
             SET access_token = ?, refresh_token = ?, 
                 access_expires_at = ?, refresh_expires_at = ?
             WHERE refresh_token = ?`,
            [newAccessToken, newRefreshToken, accessExpiresAt, refreshExpiresAt, refresh_token]
        );

        await connection.commit();

        res.json({
            status: 'success',
            data: {
                tokens: {
                    access: newAccessToken,
                    refresh: newRefreshToken,
                    accessExpiresAt,
                    refreshExpiresAt
                }
            }
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const logout = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            throw new Error('Token is required');
        }

        await connection.beginTransaction();

        await connection.query(
            'DELETE FROM user_tokens WHERE access_token = ?',
            [token]
        );

        await connection.commit();
        
        res.json({
            status: 'success',
            message: 'Logged out successfully'
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

module.exports = { register, login, requestPasswordReset, verifyCode, resetPassword, refreshToken, logout };