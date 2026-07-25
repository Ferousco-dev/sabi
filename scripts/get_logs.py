import ftplib

SERVER_IP = "131.153.147.186"
FTP_USER = "sabihubn"
FTP_PASS = "0GWdp74*XY8wr!"
REMOTE_PATH = "public_html"

def get_logs():
    print(f"🚀 Connecting to FTP {SERVER_IP}...")
    try:
        ftp = ftplib.FTP(SERVER_IP)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd(REMOTE_PATH)

        print("⬇️ Downloading error_log...")
        with open("remote_error_log.txt", "wb") as f:
            ftp.retrbinary("RETR error_log", f.write)

        ftp.quit()
        print("✅ Logs downloaded to remote_error_log.txt")
    except Exception as e:
        print(f"❌ FTP Error: {e}")

if __name__ == "__main__":
    get_logs()
