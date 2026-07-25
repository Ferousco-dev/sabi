import os
import tarfile
import ftplib
import requests
import urllib3
import time

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
SERVER_IP = "131.153.147.186"
FTP_USER = "sabihubn"
FTP_PASS = "0GWdp74*XY8wr!"
REMOTE_PATH = "public_html"
BASE_URL = "http://www.sabihub.ng" # Main domain for deployment trigger
API_URL = "http://api.sabihub.ng"    # Subdomain for API checks

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def package_api():
    print("📦 Packaging API...")
    if os.path.exists("api.tar.gz"):
        os.remove("api.tar.gz")
    with tarfile.open("api.tar.gz", "w:gz") as tar:
        # Add contents of api/ directly
        for item in os.listdir("api"):
            tar.add(os.path.join("api", item), arcname=item)
        # Add database files
        tar.add("docs/database_v2.sql", arcname="database_v2.sql")
        tar.add("docs/database_v2_seed.sql", arcname="database_v2_seed.sql")
    print("✅ Created api.tar.gz")

def upload_to_cpanel():
    print(f"🚀 Connecting to FTP {SERVER_IP}...")
    try:
        ftp = ftplib.FTP(SERVER_IP)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(REMOTE_PATH)

        print("⬆️ Uploading api.tar.gz...")
        with open("api.tar.gz", "rb") as f:
            ftp.storbinary("STOR api.tar.gz", f)

        print("⬆️ Uploading deploy.php...")
        with open("deploy.php", "rb") as f:
            ftp.storbinary("STOR deploy.php", f)

        ftp.quit()
        print("✅ Upload complete.")
    except Exception as e:
        print(f"❌ FTP Error: {e}")
        exit(1)

def trigger_remote_scripts():
    print("🛠 Triggering remote deployment...")

    # 1. Deploy (via main domain)
    print(f"📡 Requesting {BASE_URL}/deploy.php...")
    try:
        res = requests.get(f"{BASE_URL}/deploy.php", headers=HEADERS, timeout=30)
        print(f"--- Deploy Result ({res.status_code}) ---")
        print(res.text[:300])
        print("-" * 30)
    except Exception as e:
        print(f"❌ Deploy Error: {e}")

    # 2. Database Setup (Try both Subdomain and Main Domain path)
    setup_urls = [
        f"{API_URL}/setup.php?key=SabiHub_Setup_2026",
        f"{BASE_URL}/api/setup.php?key=SabiHub_Setup_2026"
    ]

    for url in setup_urls:
        print(f"📡 Requesting DB Setup: {url}...")
        try:
            res = requests.get(url, headers=HEADERS, timeout=30)
            print(f"--- Result ({res.status_code}) ---")
            print(res.text[:300])
            if res.status_code == 200 and "complete" in res.text:
                print("✅ DB Setup Success!")
                break
            print("-" * 30)
        except Exception as e:
            print(f"❌ Error: {e}")

    # 3. Healthcheck
    health_urls = [f"{API_URL}/healthcheck.php", f"{BASE_URL}/api/healthcheck.php"]
    for url in health_urls:
        print(f"📡 Checking API Health: {url}...")
        try:
            res = requests.get(url, headers=HEADERS, timeout=30)
            print(f"Result ({res.status_code}): {res.text}")
            if res.status_code == 200: break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    package_api()
    upload_to_cpanel()
    trigger_remote_scripts()
    print("\n🎉 All Done!")
