# GET /search

Search for conviction records by defendant name.

## Endpoint Details

- **Method**: GET
- **Path**: `/search`
- **Response**: [PaginatedResponse](../overview.md#paginatedresponse)

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Defendant name to search (partial match, case-insensitive) |
| `limit` | integer | No | Records per page (default: 10, max: 1000) |
| `offset` | integer | No | Records to skip for pagination (default: 0) |

## Request Examples

### Search for "JOHN"
```bash
curl "http://localhost:8000/search?name=JOHN"
```

### Search for "SMITH" with pagination
```bash
curl "http://localhost:8000/search?name=SMITH&limit=20&offset=0"
```

### Partial name search
```bash
curl "http://localhost:8000/search?name=DOE"
```

## Response Example

```json
{
  "total": 5,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "CYBER CRIME",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    }
  ]
}
```

## Search Behavior

- **Case-insensitive** - "john", "JOHN", "John" all match
- **Partial matching** - "DOE" matches "JOHN DOE", "JANE DOE"
- **Whitespace handling** - Leading/trailing spaces trimmed
- **Special characters** - Handled in preprocessing

## No Results

If no records match:

```json
{
  "total": 0,
  "limit": 10,
  "offset": 0,
  "data": []
}
```

## Examples Integration

### JavaScript/React
```javascript
import axios from 'axios';

const searchByName = async (name) => {
  try {
    const response = await axios.get('http://localhost:8000/search', {
      params: {
        name: name,
        limit: 20,
        offset: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
  }
};

// Usage
const results = await searchByName('JOHN');
console.log(`Found ${results.total} matches`);
```

### Python
```python
import requests

response = requests.get(
    'http://localhost:8000/search',
    params={
        'name': 'JOHN',
        'limit': 20,
        'offset': 0
    }
)

data = response.json()
print(f"Found {data['total']} matches")
for conviction in data['data']:
    print(f"- {conviction['name']}: {conviction['offense']}")
```

## Error Responses

### Missing Name Parameter
```json
{
  "detail": "Query parameter \"name\" is required"
}
```

### Invalid Limit/Offset
```json
{
  "detail": "Limit must be between 1 and 1000"
}
```

## Performance Notes

- **Simple search**: ~1-50ms for typical query
- **Large results**: Pagination recommended for 100+ results
- **Indexing**: Consider database indexing for production

## Related Endpoints

- [Get Convictions](./convictions.md)
- [Filter by Offense](./offense.md)
- [Filter by Court](./court.md)

---

**Documentation Version**: 1.0.0
