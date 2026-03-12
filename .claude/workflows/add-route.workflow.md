---
name: add-route
description: Procedure for creating a new Express route
---

Steps:

1. Determine if the route is public or protected.
2. If protected, add requireAuth middleware.
3. Implement route inside src/routes.
4. Validate inputs.
5. Use prepared statements for database queries.
6. Return structured JSON responses.

Output format:

{
  success: boolean,
  data?: object,
  error?: string
}