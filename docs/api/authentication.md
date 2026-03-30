# Authentication

Authentication and authorization for Nigeria's Fraud Conviction Records API.

## Current Status

The API currently **does not require authentication** as it serves publicly available fraud conviction records.

## Future Authentication

In a production environment with user accounts, implement:

### JWT (JSON Web Tokens)

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials: HTTPBearer = Depends(security)):
    token = credentials.credentials
    # Verify token
    return token
```

### OAuth2

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
async def login(username: str, password: str):
    # Authenticate user and return token
    pass
```

## API Key Authentication

For programmatic access:

```python
@app.get("/convictions")
async def get_convictions(api_key: str = Header(None)):
    if api_key != os.getenv("API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    # Return data
```

See [Full API Documentation](./overview.md) for current endpoints.
