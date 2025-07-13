# Security Enhancements Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install express-rate-limit express-validator helmet
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Security Settings
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

### 3. Database Optimization

Run this SQL to add indexes for better security performance:

```sql
-- Add indexes for better query performance
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_user_tokens_access_token ON user_tokens(access_token);
CREATE INDEX idx_user_tokens_expires ON user_tokens(access_expires_at);
```

## 🛡️ Security Features Implemented

### Backend Security

#### ✅ Input Validation & Sanitization
- **Express-validator** middleware for all endpoints
- **XSS protection** through input sanitization
- **SQL injection prevention** through parameterized queries
- **File upload validation** with type and size restrictions

#### ✅ Rate Limiting
- **Authentication endpoints**: 10 attempts per 15 minutes
- **Admin endpoints**: 200 requests per 15 minutes
- **File uploads**: 50 uploads per hour
- **Password resets**: 5 attempts per hour
- **Registration**: 3 registrations per hour

#### ✅ Security Headers
- **Helmet.js** for comprehensive security headers
- **Content Security Policy (CSP)**
- **HSTS** for HTTPS enforcement
- **X-Content-Type-Options** to prevent MIME sniffing

#### ✅ Database Authorization
- **Role-based query filtering**
- **Access validation** at database level
- **Data sanitization** based on user role

### Frontend Security

#### ✅ Enhanced Token Management
- **SessionStorage** instead of localStorage (better security)
- **Token validation** and automatic cleanup
- **Activity monitoring** with automatic logout
- **Session expiry** handling

#### ✅ Route Protection
- **Role-based route wrapping**
- **Component-level access checks**
- **Automatic redirects** for unauthorized access

## 📋 Configuration Options

### Rate Limiting Configuration

Edit `backend/middleware/rateLimiting.js` to adjust limits:

```javascript
// Example: Increase admin rate limit
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Increase from 200 to 500
    // ... other options
});
```

### Validation Rules

Edit `backend/middleware/validation.js` to modify validation:

```javascript
// Example: Stronger password requirements
body('password')
    .isLength({ min: 12 }) // Increase minimum length
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character');
```

### Token Storage Configuration

Edit `client/src/common/context/secureAuthContext.jsx`:

```javascript
// Example: Shorter session timeout
const maxInactiveTime = 2 * 60 * 60 * 1000; // 2 hours instead of 24
```

## 🔧 Testing Security Features

### 1. Test Rate Limiting

```bash
# Test authentication rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### 2. Test Input Validation

```bash
# Test XSS protection
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"<script>alert(1)</script>","email":"test@test.com"}'
```

### 3. Test Authorization

```bash
# Test admin-only endpoint without admin token
curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer customer-token"
```

## 🚨 Security Monitoring

### Log Analysis

Monitor these log patterns:

```bash
# Rate limit violations
grep "RATE_LIMIT_EXCEEDED" backend/logs/error.log

# Validation failures
grep "Validation failed" backend/logs/error.log

# Authentication failures
grep "Authentication failed" backend/logs/error.log
```

### Security Alerts

Set up monitoring for:
- **Repeated rate limit violations**
- **Multiple authentication failures**
- **Unusual admin activity patterns**
- **Failed validation attempts**

## 🔒 Production Recommendations

### 1. Environment Security

```bash
# Set secure environment variables
export NODE_ENV=production
export JWT_SECRET=$(openssl rand -base64 64)
export JWT_REFRESH_SECRET=$(openssl rand -base64 64)
```

### 2. HTTPS Configuration

Ensure HTTPS is enabled in production:

```javascript
// Add to app.js for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}
```

### 3. Database Security

```sql
-- Create read-only user for analytics
CREATE USER 'analytics'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON *.* TO 'analytics'@'%';

-- Revoke unnecessary privileges
REVOKE ALL PRIVILEGES ON *.* FROM 'app_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON app_database.* TO 'app_user'@'%';
```

## 🔍 Security Checklist

### Before Deployment

- [ ] Change all default passwords
- [ ] Update JWT secrets
- [ ] Enable HTTPS
- [ ] Configure firewalls
- [ ] Set up monitoring
- [ ] Test all security features
- [ ] Review error logging
- [ ] Validate backup procedures

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Monitor rate limit violations
- [ ] Check for security vulnerabilities
- [ ] Rotate JWT secrets quarterly
- [ ] Audit user permissions
- [ ] Test backup restoration

## 📞 Security Incident Response

### If Security Breach Detected

1. **Immediate Actions**
   - Revoke all active tokens
   - Reset JWT secrets
   - Enable emergency rate limiting
   - Document the incident

2. **Investigation**
   - Analyze logs for attack patterns
   - Identify compromised accounts
   - Assess data exposure
   - Update security measures

3. **Recovery**
   - Patch vulnerabilities
   - Notify affected users
   - Implement additional monitoring
   - Review security policies

## 🆘 Troubleshooting

### Common Issues

**Rate Limiting Too Aggressive**
```javascript
// Temporarily increase limits in development
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 100 : 10
});
```

**Validation Rejecting Valid Input**
```javascript
// Check validation rules in middleware/validation.js
// Adjust regex patterns if needed
```

**Token Storage Issues**
```javascript
// Clear all storage and retry
sessionStorage.clear();
localStorage.clear();
```

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

## 📝 Notes

This security implementation provides enterprise-grade protection while maintaining usability. All features are production-ready and have been tested for performance impact.

For questions or security concerns, please review the implementation and consult security documentation. 