---
name: security-audit
description: Perform security review of Node.js backend code
triggers:
  - modifying authentication
  - creating express routes
  - database access
---

# Security Audit Procedure

When reviewing code:

1. Check for SQL injection vulnerabilities.
2. Verify password hashing uses Argon2.
3. Ensure admin routes require authentication.
4. Confirm secrets are stored in environment variables.
5. Ensure no sensitive data is logged.

If a vulnerability is detected:
- explain the issue
- propose a secure fix