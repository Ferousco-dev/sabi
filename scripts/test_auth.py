import requests

BASE_URL = "http://www.sabihub.ng/api"

def test_login():
    print("🧪 Testing Login with Seed Data...")
    payload = {
        "email": "admin@sabihub.ng",
        "password": "password" # password from seed data
    }
    try:
        res = requests.post(f"{BASE_URL}/auth/login.php", json=payload)
        print(f"Status: {res.status_code}")
        print(f"Result: {res.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login()
