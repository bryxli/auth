# auth

Auth API for [bryxli](https://github.com/bryxli)

This API provides authentication and registration endpoints for user management. It is built using SST, AWS Lambda, and DynamoDB.

---

## API Endpoints

### Health Check

**GET /**  
Returns a simple health check response.

**Example:**

```http
GET /
```

**Response:**

```
Healthy!
```

### Authenticate

**POST /authenticate**
Authenticates a user and returns a JWT token.

**Request Body:**
Full list of `User` parameters can be found [here](packages/core/src/utils/types.ts#L7).

```
{
    "user_id": "your-username",
    ...
}
```

For social login, add `type` parameter.

**Example:** This example uses default, password-based credentials.

```http
POST /authenticate
Content-Type: application/json

{
    "user_id": "your-username",
    "password": "your-password"
}
```

**Response:**

```
{
    "message": "Authenticated",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Possible Errors:**

- 400: Invalid input (malformed JSON or validation error)
- 401: Unauthorized (invalid credentials)
- 405: Method Not Allowed (if not POST)
- 500: Internal server error

---

### Register

**POST /register**
Registers a new user account using default type credentials (password).

**Request Body:**

```
{
    "user_id": "your-username",
    "password" "your-password"
}
```

**Example:**

```http
POST /register
Content-Type: application/json

{
    "user_id": "your-username",
    "password": "your-password"
}
```

**Response:**

```
{
    "message": "Registered",
    "userInfo": {
        "user_id" "your-username",
        "password": ""
    }
}
```

**Possible Errors:**

- 400: Invalid input (malformed JSON or validation error)
- 403: Password already exists
- 405: Method Not Allowed (if not POST)
- 500: Internal server error

---

## Secrets & Variables

### Environment Variables

- `JWT_SECRET`
- `USERS_TABLE`

---

### GitHub Secrets

- `AWS_ACCOUNT_ID`
- `AWS_REGION`
- `SONAR_TOKEN`

## Status

[![Dev Status](https://github.com/bryxli/auth/actions/workflows/dev.yml/badge.svg)](https://github.com/bryxli/auth/actions/workflows/dev.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bryxli_auth&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=bryxli_auth)
