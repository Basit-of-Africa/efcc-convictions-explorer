"""
Quick test script to verify EFCC Convictions Explorer API.
"""

import time
import subprocess
import sys
import os
from pathlib import Path
import requests

# Change to script directory
os.chdir(Path(__file__).parent)

# Start the server in a subprocess
print("🚀 Starting EFCC Convictions Explorer API...")
print("-" * 70)

server_process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
    cwd=Path(__file__).parent,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

# Give the server time to start
print("Waiting for server to initialize...")
time.sleep(8)  # Increased wait time to allow data loading

# Check server output for any errors
import threading
def read_output(process):
    for line in process.stdout:
        if line.strip():
            print(f"[SERVER] {line.rstrip()}")

output_thread = threading.Thread(target=read_output, args=(server_process,), daemon=True)
output_thread.start()

BASE_URL = "http://localhost:8000"

try:
    # Test 1: Health Check
    print("\n1️⃣  Testing Health Check (GET /)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Response: {data}")
    assert response.status_code == 200
    print("   ✅ PASSED\n")
    
    # Test 2: Get All Convictions
    print("2️⃣  Testing Get All Convictions (GET /convictions)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/convictions?limit=3")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Total records: {data['total']}")
    print(f"   Records returned: {len(data['data'])}")
    print(f"   First record: {data['data'][0]['name'] if data['data'] else 'N/A'}")
    assert response.status_code == 200
    assert data['total'] > 0
    print("   ✅ PASSED\n")
    
    # Test 3: Search by Name
    print("3️⃣  Testing Search by Name (GET /search?name=JOHN)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/search?name=JOHN")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Matches found: {data['total']}")
    if data['data']:
        print(f"   First match: {data['data'][0]['name']}")
    assert response.status_code == 200
    print("   ✅ PASSED\n")
    
    # Test 4: Filter by Offense
    print("4️⃣  Testing Filter by Offense (GET /offense?type=FRAUD)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/offense?type=FRAUD")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Fraud cases found: {data['total']}")
    if data['data']:
        print(f"   First case: {data['data'][0]['name']}")
    assert response.status_code == 200
    print("   ✅ PASSED\n")
    
    # Test 5: Filter by Court
    print("5️⃣  Testing Filter by Court (GET /court?name=FEDERAL)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/court?name=FEDERAL")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Cases in Federal courts: {data['total']}")
    assert response.status_code == 200
    print("   ✅ PASSED\n")
    
    # Test 6: Get Statistics
    print("6️⃣  Testing Statistics (GET /stats)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/stats")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Total cases: {data['total_cases']}")
    print(f"   Most common offense: {data['most_common_offense']}")
    print(f"   Unique courts: {data['unique_courts']}")
    print(f"   Unique offenses: {data['unique_offenses']}")
    print(f"   Avg prison term: {data['average_prison_term_months']} months")
    assert response.status_code == 200
    print("   ✅ PASSED\n")
    
    # Test 7: Pagination
    print("7️⃣  Testing Pagination (GET /convictions?limit=2&offset=1)")
    print("   " + "-" * 60)
    response = requests.get(f"{BASE_URL}/convictions?limit=2&offset=1")
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Total: {data['total']}, Limit: {data['limit']}, Offset: {data['offset']}")
    print(f"   Records returned: {len(data['data'])}")
    assert response.status_code == 200
    assert data['offset'] == 1
    assert data['limit'] == 2
    print("   ✅ PASSED\n")
    
    print("=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    print("\n📖 API is ready! Access documentation at:")
    print(f"   • Swagger UI: {BASE_URL}/docs")
    print(f"   • ReDoc: {BASE_URL}/redoc")
    print("\n")
    
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to server on localhost:8000")
    print("   Make sure the server is running correctly")
    sys.exit(1)
except Exception as e:
    print(f"❌ Test failed with error: {e}")
    sys.exit(1)
finally:
    # Kill the server
    print("Shutting down server...")
    server_process.terminate()
    server_process.wait(timeout=5)
    print("✓ Server stopped")
