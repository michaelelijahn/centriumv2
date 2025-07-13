const pool = require('../config/db');

const registerBank = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { bank_name, bank_branch, bank_address, swift_code, user_id, account_number, account_holder_name } = req.body;
    
    await connection.beginTransaction();
    
    const [existingBank] = await connection.execute(
      'SELECT bank_id FROM banks WHERE bank_name = ? AND bank_branch = ? AND swift_code = ?',
      [bank_name, bank_branch, swift_code]
    );
    
    let bankId;
    if (existingBank.length > 0) {
      bankId = existingBank[0].bank_id;
    } else {
      const [bankResult] = await connection.execute(
        'INSERT INTO banks (bank_name, bank_branch, bank_address, swift_code) VALUES (?, ?, ?, ?)',
        [bank_name, bank_branch, bank_address, swift_code]
      );
      bankId = bankResult.insertId;
    }

    const [accountResult] = await connection.execute(
      'INSERT INTO bank_accounts (user_id, bank_id, account_number, account_holder_name) VALUES (?, ?, ?, ?)',
      [user_id, bankId, account_number, account_holder_name]
    );

    await connection.commit();
    
    res.json({
      success: true,
      data: {
        id: accountResult.insertId,
        bank_id: bankId,
        message: 'Bank account registration successful'
      }
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = { registerBank };