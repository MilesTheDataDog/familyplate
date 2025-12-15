# Security

Comprehensive security documentation for FamilyPlate, including threat models, security measures, and best practices.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Security Overview](#security-overview)
- [Threat Model](#threat-model)
- [API Security](#api-security)
- [Data Security](#data-security)
- [Client-Side Security](#client-side-security)
- [Deployment Security](#deployment-security)
- [Security Best Practices](#security-best-practices)
- [Incident Response](#incident-response)

---

## Security Overview

### Security Principles

FamilyPlate follows these core security principles:

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimal permissions required
3. **Fail Secure**: Errors don't expose vulnerabilities
4. **Security by Default**: Secure configurations out of the box
5. **Transparency**: Clear security documentation

### Security Posture

**Current Status**: ✅ Secure for MVP

- API keys protected via environment variables
- No user authentication (single-user app)
- Client-side only sensitive data storage
- HTTPS enforced on all connections
- No SQL injection risk (no database)

---

## Threat Model

### Assets to Protect

1. **API Keys**: Anthropic API key
2. **User Data**: Recipe images and text
3. **Application Code**: Proprietary logic
4. **User Privacy**: Recipe content

### Threat Actors

#### Low Risk
- **Casual Users**: No malicious intent
- **Curious Browsers**: View source explorers

#### Medium Risk
- **Script Kiddies**: Automated scanning tools
- **Competitors**: Business intelligence gathering

#### High Risk (Not Applicable Yet)
- **Advanced Persistent Threats**: Not a target
- **Nation-State Actors**: Not relevant

### Attack Vectors

#### 1. API Key Exposure
**Risk Level**: 🔴 CRITICAL

**Attack**: Attacker obtains Anthropic API key

**Impact**:
- Unauthorized API usage
- Cost implications
- Rate limit exhaustion

**Mitigation**:
- ✅ API keys in environment variables (server-side only)
- ✅ Never in client-side code
- ✅ Never in Git repository
- ✅ Serverless functions act as proxy

**Current Protection**:
```javascript
// ❌ NEVER DO THIS (exposed to client)
const apiKey = 'sk-ant-api-key-here';

// ✅ CORRECT (server-side only)
const apiKey = process.env.ANTHROPIC_API_KEY;
```

#### 2. Cross-Site Scripting (XSS)
**Risk Level**: 🟡 MEDIUM

**Attack**: Inject malicious scripts via recipe content

**Impact**:
- Execute unauthorized JavaScript
- Steal localStorage data
- Redirect users

**Mitigation**:
- ✅ React auto-escapes content
- ✅ No dangerouslySetInnerHTML used
- ✅ Content sanitization

**Protection**:
```javascript
// React automatically escapes
<h1>{recipe.title}</h1> // Safe - auto-escaped

// If HTML needed (avoid)
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(content)
}} />
```

#### 3. Data Exposure via localStorage
**Risk Level**: 🟢 LOW

**Attack**: Access localStorage via browser DevTools

**Impact**:
- Read user's recipes
- Modify recipe data
- Delete recipes

**Mitigation**:
- ⚠️ Single-user application (user controls device)
- ✅ No sensitive personal information stored
- ✅ Data encrypted in future versions

**Current Limitation**:
```javascript
// Anyone with device access can:
localStorage.getItem('recipe:12345');

// Future: Encrypt before storage
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(recipe),
  userKey
);
localStorage.setItem('recipe:12345', encrypted);
```

#### 4. Man-in-the-Middle (MITM)
**Risk Level**: 🟢 LOW

**Attack**: Intercept network traffic

**Impact**:
- Read recipe content in transit
- Modify API responses

**Mitigation**:
- ✅ HTTPS enforced by Vercel
- ✅ Automatic SSL certificates
- ✅ Secure headers

#### 5. Denial of Service (DoS)
**Risk Level**: 🟡 MEDIUM

**Attack**: Overwhelm API with requests

**Impact**:
- Exhaust API quota
- Increase costs
- Degrade service

**Mitigation**:
- ✅ Vercel rate limiting
- ✅ Serverless auto-scaling
- ⚠️ No request throttling (add in future)

**Future Protection**:
```javascript
// Add rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
```

#### 6. Code Injection
**Risk Level**: 🟢 LOW

**Attack**: Inject malicious code via inputs

**Impact**:
- Execute unauthorized code
- Data manipulation

**Mitigation**:
- ✅ No eval() usage
- ✅ No new Function() usage
- ✅ Input validation
- ✅ Type checking

---

## API Security

### Authentication

**Current**: No authentication required (single-user app)

**Anthropic API**:
```javascript
// Server-side authentication
headers: {
  'x-api-key': process.env.ANTHROPIC_API_KEY // Secure
}
```

### Authorization

**Current**: Not applicable (no multi-user)

**Future Multi-User**:
```javascript
// Verify user owns resource
if (recipe.userId !== authenticatedUser.id) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

### Input Validation

**Serverless Functions**:
```javascript
export default async function handler(req, res) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 2. Required field validation
  const { image, type, prompt } = req.body;
  if (!image || !type || !prompt) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }
  
  // 3. Type validation
  if (typeof image !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid image format' 
    });
  }
  
  // 4. Size validation
  if (image.length > 10 * 1024 * 1024) { // 10MB
    return res.status(413).json({ 
      error: 'Image too large' 
    });
  }
  
  // Process request...
}
```

### API Key Rotation

**Best Practice**:
```bash
# Rotate API keys every 90 days
# Steps:
1. Generate new API key in Anthropic console
2. Update Vercel environment variable
3. Trigger redeployment
4. Delete old API key
5. Monitor for errors
```

### API Error Handling

**Secure Error Messages**:
```javascript
try {
  const result = await callAnthropicAPI();
  return res.status(200).json(result);
} catch (error) {
  // ❌ Don't expose internal errors
  // return res.status(500).json({ error: error.message });
  
  // ✅ Generic error message
  console.error('API Error:', error); // Log for debugging
  return res.status(500).json({ 
    error: 'Failed to process request' 
  });
}
```

---

## Data Security

### Data at Rest

**Current**: localStorage (unencrypted)

**Risk**: Anyone with device access can read recipes

**Future Encryption**:
```javascript
// Encrypt before storing
import CryptoJS from 'crypto-js';

const encryptData = (data, password) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    password
  );
  return encrypted.toString();
};

const decryptData = (encryptedData, password) => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedData,
    password
  );
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};

// Usage
const encrypted = encryptData(recipe, userPassword);
localStorage.setItem('recipe:123', encrypted);
```

### Data in Transit

**HTTPS Everywhere**:
```
All connections use TLS 1.3
├─ Client → Vercel: HTTPS
├─ Vercel → Anthropic: HTTPS
└─ All assets: HTTPS
```

**Security Headers** (Vercel automatic):
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Data Backup

**Current**: User responsible for backups

**Future**:
```javascript
// Export all recipes
const exportRecipes = async () => {
  const recipes = await loadAllRecipes();
  const json = JSON.stringify(recipes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Download
  const a = document.createElement('a');
  a.href = url;
  a.download = `familyplate-backup-${Date.now()}.json`;
  a.click();
};
```

### Data Retention

**Current**: Indefinite (user controls deletion)

**Future Policy**:
- User data retained as long as account active
- 30-day grace period after account deletion
- Complete data purge after 30 days

---

## Client-Side Security

### Content Security Policy (CSP)

**Future Implementation**:
```html
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.anthropic.com;
    font-src 'self';
  "
>
```

### Subresource Integrity (SRI)

**For CDN Resources**:
```html
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-hash"
  crossorigin="anonymous">
</script>
```

### localStorage Security

**Best Practices**:
```javascript
// 1. Validate before storing
const saveRecipe = (recipe) => {
  if (!isValidRecipe(recipe)) {
    throw new Error('Invalid recipe data');
  }
  localStorage.setItem(`recipe:${recipe.id}`, JSON.stringify(recipe));
};

// 2. Validate after loading
const loadRecipe = (id) => {
  const data = localStorage.getItem(`recipe:${id}`);
  const recipe = JSON.parse(data);
  
  if (!isValidRecipe(recipe)) {
    throw new Error('Corrupted recipe data');
  }
  
  return recipe;
};

// 3. Handle errors gracefully
try {
  const recipe = loadRecipe(id);
} catch (error) {
  console.error('Failed to load recipe:', error);
  // Show user-friendly message
  // Don't expose error details
}
```

---

## Deployment Security

### Environment Variables

**Secure Management**:
```bash
# ✅ CORRECT: Store in Vercel dashboard
Vercel Dashboard → Settings → Environment Variables
ANTHROPIC_API_KEY=sk-ant-...

# ❌ NEVER: Commit to Git
# .env (should be in .gitignore)
ANTHROPIC_API_KEY=sk-ant-...
```

**Environment Variable Security**:
```javascript
// Verify environment variable exists
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY not configured');
}

// Use environment variable
const apiKey = process.env.ANTHROPIC_API_KEY;
```

### Secrets Management

**Best Practices**:
1. Rotate secrets every 90 days
2. Use separate keys for dev/staging/prod
3. Never log secret values
4. Use secret scanning tools

### Git Security

**.gitignore**:
```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# API keys
*key*
*secret*
*token*

# Build artifacts
/build
/dist

# Dependencies
/node_modules
```

**Pre-commit Hook**:
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Check for secrets
if git diff --cached | grep -i "api.key\|secret\|password"; then
  echo "⚠️  Possible secret detected!"
  exit 1
fi
```

---

## Security Best Practices

### Development

1. **Never log sensitive data**
```javascript
// ❌ WRONG
console.log('API Key:', apiKey);

// ✅ CORRECT
console.log('API call successful');
```

2. **Validate all inputs**
```javascript
const validateRecipe = (recipe) => {
  if (!recipe.title || recipe.title.length > 200) {
    return false;
  }
  if (!Array.isArray(recipe.instructions)) {
    return false;
  }
  return true;
};
```

3. **Handle errors securely**
```javascript
// ❌ Exposes stack trace
catch (error) {
  res.json({ error: error.stack });
}

// ✅ Generic message
catch (error) {
  console.error(error); // Log internally
  res.json({ error: 'An error occurred' });
}
```

### Deployment

1. **Use HTTPS only**
2. **Enable security headers**
3. **Keep dependencies updated**
4. **Monitor for vulnerabilities**

```bash
# Regular security audits
npm audit
npm audit fix

# Check for outdated packages
npm outdated
```

### Monitoring

**Future Implementation**:
```javascript
// Log security events
const logSecurityEvent = (event) => {
  console.log({
    timestamp: new Date().toISOString(),
    event: event.type,
    user: event.userId,
    ip: event.ip
  });
};

// Examples:
logSecurityEvent({ type: 'api_key_used', userId: 'system' });
logSecurityEvent({ type: 'failed_login', userId: email });
logSecurityEvent({ type: 'data_export', userId: userId });
```

---

## Incident Response

### Security Incident Procedures

#### 1. Detection
- Monitor error logs
- Check for unusual API usage
- Review security alerts

#### 2. Assessment
- Determine severity
- Identify affected systems
- Estimate impact

#### 3. Containment
- Rotate compromised keys immediately
- Block malicious IPs
- Disable affected features

#### 4. Recovery
- Deploy security patches
- Restore from backups if needed
- Verify system integrity

#### 5. Post-Incident
- Document incident
- Update security measures
- Communicate with users

### Emergency Contacts

```
Security Issue: [Create GitHub Issue]
Critical Vulnerability: [Security Email]
API Key Compromise: 
  1. Revoke key in Anthropic console
  2. Update Vercel environment variable
  3. Redeploy application
```

---

## Security Checklist

### Before Deployment

- [ ] API keys in environment variables
- [ ] No secrets in Git repository
- [ ] All dependencies up to date
- [ ] `npm audit` shows no critical issues
- [ ] HTTPS enforced
- [ ] Error messages don't expose internals
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured (future)
- [ ] Security headers enabled

### Regular Maintenance

- [ ] Rotate API keys (90 days)
- [ ] Update dependencies (monthly)
- [ ] Review security logs (weekly)
- [ ] Test backup/restore (monthly)
- [ ] Security audit (quarterly)

---

## Related Documentation

- [Architecture Overview](./overview.md)
- [API Documentation](../api/)
- [Deployment Guide](../guides/deployment.md)