import os
import tarfile
import ftplib
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
SERVER_IP = "131.153.147.186"
FTP_USER = "sabihubn"
FTP_PASS = "0GWdp74*XY8wr!"
REMOTE_PATH = "public_html"
BASE_URL = "http://www.sabihub.ng"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
}

def package_api():
    print("📦 Packaging API...")
    if os.path.exists("api.tar.gz"):
        os.remove("api.tar.gz")
    with tarfile.open("api.tar.gz", "w:gz") as tar:
        # Add contents of api/ directly
        for item in os.listdir("api"):
            tar.add(os.path.join("api", item), arcname=item)
        # Add database files directly into the tar root (will be in /api/ on server)
        tar.add("docs/database_v2.sql", arcname="database_v2.sql")
        tar.add("docs/database_v2_seed.sql", arcname="database_v2_seed.sql")
    print("✅ Created api.tar.gz")

def upload_to_cpanel():
    print(f"🚀 Connecting to FTP {SERVER_IP}...")
    try:
        ftp = ftplib.FTP(SERVER_IP)
        ftp.login(FTP_USER, FTP_PASS)

        print(f"📁 Changing directory to {REMOTE_PATH}...")
        ftp.cwd(REMOTE_PATH)

        print("⬆️ Uploading api.tar.gz...")
        with open("api.tar.gz", "rb") as f:
            ftp.storbinary("STOR api.tar.gz", f)

        print("⬆️ Uploading deploy.php...")
        with open("deploy.php", "rb") as f:
            ftp.storbinary("STOR deploy.php", f)

        print("📜 Remote directory listing:")
        ftp.dir()

        ftp.quit()
        print("✅ Upload complete.")
    except Exception as e:
        print(f"❌ FTP Error: {e}")
        exit(1)

def trigger_remote_scripts():
    print("🛠 Triggering remote deployment...")

    # Wait a second for filesystem to sync
    time.sleep(2)

    scripts = [
        ("Deploy", f"{BASE_URL}/deploy.php"),
        ("DB Setup", f"{BASE_URL}/api/setup.php?key=SabiHub_Setup_2026"),
        ("Healthcheck", f"{BASE_URL}/api/healthcheck.php")
    ]

    for name, url in scripts:
        print(f"📡 Requesting {url}...")
        try:
            # Try both http and https if needed, but start with URL as is
            res = requests.get(url, headers=HEADERS, timeout=30, verify=False)
            print(f"--- {name} Result ({res.status_code}) ---")
            print(res.text[:500] + ("..." if len(res.text) > 500 else ""))
            print("-" * 30)
        except Exception as e:
            print(f"❌ {name} Error: {e}")
            # Try with IP fallback if domain fails
            if "sabihub.ng" in url:
                ip_url = url.replace("www.sabihub.ng", SERVER_IP).replace("sabihub.ng", SERVER_IP)
                print(f"🔄 Retrying with IP: {ip_url}...")
                try:
                    res = requests.get(ip_url, headers={"Host": "www.sabihub.ng", **HEADERS}, timeout=30, verify=False)
                    print(f"--- {name} (IP) Result ({res.status_code}) ---")
                    print(res.text[:500])
                    print("-" * 30)
                except Exception as e2:
                    print(f"❌ {name} (IP) Error: {e2}")

import time

if __name__ == "__main__":
    package_api()
    upload_to_cpanel()
    trigger_remote_scripts()
    print("\n🎉 All Done!")
