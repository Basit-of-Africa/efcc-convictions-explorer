# Nigeria's Fraud Conviction Records Explorer

A production-ready FastAPI backend for processing and analyzing publicly available fraud conviction records from Nigeria's federal courts.

## 🎯 Features

- **CSV Data Loading**: Automatically loads and processes conviction records
- **Data Cleaning**: Handles messy, inconsistent data with smart preprocessing
- **Search & Filter**: Search by defendant name, offense type, or court
- **Analytics**: Generate statistics on conviction patterns
- **Pagination**: All endpoints support limit/offset pagination
- **Type Safety**: Full Pydantic models and type hints
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## 📂 Project Structure

```
efcc-convictions-explorer/
├── main.py                 # FastAPI application & endpoints
├── models.py              # Pydantic data models
├── data_cleaning.py       # Data preprocessing utilities
├── requirements.txt       # Python dependencies
├── efcc_convictions.csv   # Input data (you provide this)
└── README.md             # This file
```

## 🧹 Data Cleaning Features

The system automatically:

- ✅ Converts all text to uppercase
- ✅ Splits multiple defendants (e.g., "John Doe & ANOR" → separate records)
- ✅ Removes ₦ symbols, commas from monetary values
- ✅ Standardizes prison terms (e.g., "5 YEARS" → 60 months)
- ✅ Handles missing values safely
- ✅ Removes duplicate records

## 🚀 Quick Start

### 1. Setup

```bash
# Navigate to project directory
cd efcc-convictions-explorer

# Create Python virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Add Data

Place your CSV file in the project root:

```bash
# Copy your CSV file
cp /path/to/efcc_convictions.csv .
```

**Expected CSV columns:**
- `name` - Defendant name(s)
- `offense` - Offense type
- `prison_term` - Prison sentence
- `fine` - Fine amount (optional)
- `restitution` - Restitution amount (optional)
- `court` - Court name

### 3. Run the Server

```bash
# Start the FastAPI server
python main.py

# Or using uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Output should show:
```
✓ Loaded 1234 conviction records from CSV
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 📡 API Endpoints

### Health Check
```http
GET /
```
Returns API status and record count.

**Response:**
```json
{
  "status": "operational",
  "message": "EFCC Convictions Explorer is running. Loaded 1234 records."
}
```

---

### Get All Convictions
```http
GET /convictions?limit=10&offset=0
```

Query parameters:
- `limit` (int, 1-1000): Records per page (default: 10)
- `offset` (int): Records to skip (default: 0)

**Response:**
```json
{
  "total": 1234,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "FRAUD",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    }
  ]
}
```

---

### Search by Name
```http
GET /search?name=JOHN&limit=10&offset=0
```

Query parameters:
- `name` (string, required): Defendant name (partial match, case-insensitive)
- `limit` (int, 1-1000): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/search?name=DOE"
```

---

### Filter by Offense
```http
GET /offense?type=FRAUD&limit=10&offset=0
```

Query parameters:
- `type` (string, required): Offense type (partial match)
- `limit` (int): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/offense?type=MONEY%20LAUNDERING"
```

---

### Filter by Court
```http
GET /court?name=FEDERAL&limit=10&offset=0
```

Query parameters:
- `name` (string, required): Court name (partial match)
- `limit` (int): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/court?name=FEDERAL%20HIGH%20COURT"
```

---

### Get Statistics
```http
GET /stats
```

**Response:**
```json
{
  "total_cases": 1234,
  "most_common_offense": "FRAUD",
  "average_prison_term_months": 48.5,
  "unique_courts": 12,
  "unique_offenses": 28
}
```

## 📖 Interactive API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive endpoint testing and full schema documentation.

## 🔍 Example Usage

### Using curl

```bash
# Health check
curl http://localhost:8000/

# List all convictions (first 5)
curl "http://localhost:8000/convictions?limit=5"

# Search for a defendant
curl "http://localhost:8000/search?name=ABUBAKAR"

# Get fraud convictions
curl "http://localhost:8000/offense?type=FRAUD"

# Get convictions from a specific court
curl "http://localhost:8000/court?name=FEDERAL"

# Get statistics
curl http://localhost:8000/stats
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Get all convictions
response = requests.get(f"{BASE_URL}/convictions", params={"limit": 10})
data = response.json()
print(f"Total records: {data['total']}")

# Search by name
response = requests.get(f"{BASE_URL}/search", params={"name": "DOE", "limit": 5})
results = response.json()
print(f"Found {results['total']} matches")

# Get stats
stats = requests.get(f"{BASE_URL}/stats").json()
print(f"Most common offense: {stats['most_common_offense']}")
print(f"Average prison term: {stats['average_prison_term_months']} months")
```

## 📋 Data Models

### ConvictionRecord
```python
{
  "name": str,              # Defendant name (uppercase)
  "offense": str,           # Offense type (uppercase)
  "prison_term": str,       # Standardized term (e.g., "5 YEARS", "LIFE")
  "prison_term_months": int | null,  # Numeric months (null for LIFE)
  "fine": str | null,       # Fine amount (digits only, ₦ removed)
  "restitution": str | null,  # Restitution (digits only)
  "court": str              # Court name (uppercase)
}
```

### StatsResponse
```python
{
  "total_cases": int,
  "most_common_offense": str,
  "average_prison_term_months": float | null,
  "unique_courts": int,
  "unique_offenses": int
}
```

## ⚙️ Configuration

### Prison Term Conversion

Prison terms are automatically converted to months:
- `YEARS` → multiplied by 12
- `MONTHS` → kept as-is
- `WEEKS` → divided by 4.4 (approx)
- `DAYS` → divided by 30 (approx)
- `LIFE` → null (no numeric conversion)

### Multiple Defendants

Records with multiple defendants are intelligently split:
- `"JOHN DOE & ANOR"` → only keeps "JOHN DOE" (ANOR = "and another")
- `"JOHN DOE AND JANE SMITH"` → creates separate records for both
- `"JOHN DOE, JANE SMITH"` → treats as single name (keeps original)

## 🐛 Troubleshooting

### "CSV file not found"
Make sure `efcc_convictions.csv` is in the same directory as `main.py`.

### Port 8000 already in use
```bash
# Use a different port
uvicorn main:app --port 8001
```

### Module import errors
```bash
# Ensure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

### No data loaded
Check that your CSV has the expected columns: `name`, `offense`, `prison_term`, `court`

## 📊 Data Quality Notes

The data cleaning pipeline is designed to handle:
- ✅ Mixed case text (converts to uppercase)
- ✅ Multiple defendants in one record
- ✅ Currency symbols and formatting
- ✅ Varied prison term formats
- ✅ Missing/null values
- ✅ Duplicate records

However, some data quality issues may persist if they are in the source data. Always validate results for critical uses.

## 📝 License

This project processes publicly available data from the EFCC. Use in accordance with applicable laws and data usage policies.

## 🤝 Support

For issues or improvements, review:
1. The [API documentation](#-interactive-api-documentation) at `/docs`
2. Console output for data loading warnings
3. Python error messages for debugging

---

**Built with:** FastAPI • Pandas • Pydantic
