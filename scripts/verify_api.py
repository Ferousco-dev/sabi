import requests

API_URL = "http://api.sabihub.ng"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def test_endpoint(name, path, method="GET", json=None, token=None):
    url = f"{API_URL}{path}"
    headers = {**HEADERS}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    print(f"🔍 Testing {name} ({path})...", end=" ", flush=True)
    try:
        if method == "POST":
            res = requests.post(url, json=json, headers=headers, timeout=10)
        else:
            res = requests.get(url, headers=headers, timeout=10)

        if res.status_code == 200:
            print("✅ OK")
            return res.json()
        else:
            print(f"❌ FAIL ({res.status_code})")
            print(f"   Response: {res.text[:200]}")
            return None
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

def verify_all():
    print("🚀 Starting API Verification...\n")

    # 1. Healthcheck
    test_endpoint("Healthcheck", "/healthcheck.php")

    # 2. Login
    print("🔑 Authenticating...")
    login_res = test_endpoint("Admin Login", "/auth/login.php", "POST", {"email": "admin@sabihub.ng", "password": "password"})
    if not login_res: return
    token = login_res.get("token")

    # 3. Admin Endpoints
    test_endpoint("School Profile", "/schools/profile.php", token=token)
    test_endpoint("Classes", "/schools/classes.php", token=token)
    test_endpoint("Enrollments", "/schools/enrollments.php", token=token)

    # 4. Teacher Login
    teacher_res = test_endpoint("Teacher Login", "/auth/login.php", "POST", {"email": "teacher@sabihub.ng", "password": "password"})
    if teacher_res:
        t_token = teacher_res.get("token")
        test_endpoint("Teacher Roster", "/teacher/roster.php", token=t_token)
        test_endpoint("Teacher Lessons", "/teacher/lessons.php", token=t_token)

    # 5. Student Login
    student_res = test_endpoint("Student Login", "/auth/login.php", "POST", {"email": "student@sabihub.ng", "password": "password"})
    if student_res:
        s_token = student_res.get("token")
        test_endpoint("Student Content", "/student/content.php", token=s_token)
        test_endpoint("Student Timetable", "/student/timetable.php", token=s_token)

    # 6. Parent Login
    parent_res = test_endpoint("Parent Login", "/auth/login.php", "POST", {"email": "parent@sabihub.ng", "password": "password"})
    if parent_res:
        p_token = parent_res.get("token")
        children = test_endpoint("Parent Children", "/parent/children.php", token=p_token)
        if children and children.get("children"):
            child_id = children["children"][0]["id"]
            test_endpoint("Child Attendance", f"/parent/attendance.php?child_id={child_id}", token=p_token)

    print("\n🏁 Verification Complete!")

if __name__ == "__main__":
    verify_all()
