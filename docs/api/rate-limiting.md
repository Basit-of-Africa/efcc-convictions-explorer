# Rate Limiting

API rate limiting and quota management.

## Current Status

Currently, the API has **no rate limiting** implemented.

## Recommended Rate Limits

For production deployment:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/` | 1000 | 1 minute |
| `/convictions` | 100 | 1 minute |
| `/search` | 100 | 1 minute |
| `/offense` | 100 | 1 minute |
| `/court` | 100 | 1 minute |
| `/stats` | 200 | 1 minute |

## Implementation

Using slowapi:

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/convictions")
@limiter.limit("100/minute")
async def get_convictions(request: Request):
    # endpoint logic
    pass
```

## Future Plans

- [ ] Implement rate limiting
- [ ] Add API key validation
- [ ] Track usage per API key
- [ ] Premium tier support

See [API Overview](./overview.md) for more details.
