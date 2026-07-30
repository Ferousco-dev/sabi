<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AssessmentConfigController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChildAttendanceController;
use App\Http\Controllers\Api\ChildResultsController;
use App\Http\Controllers\Api\ChildrenController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EmergencyContactController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\GuardianController;
use App\Http\Controllers\Api\HolidayController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\SubmissionController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TermController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ResolveTenant;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/invitations/accept', [InvitationController::class, 'accept']);

// ── Authenticated + tenant-scoped ───────────────────────────────────────────
Route::middleware(['auth:sanctum', ResolveTenant::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ── Reads (any authenticated user in tenant; some filtered by role in-controller) ──
    Route::get('/classes', [ClassController::class, 'index']);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/timetable', [TimetableController::class, 'index']);
    Route::get('/enrollments', [EnrollmentController::class, 'index']);
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/assessment-configs', [AssessmentConfigController::class, 'index']);
    Route::get('/results', [ResultController::class, 'index']);
    Route::get('/sessions', [SessionController::class, 'index']);
    Route::get('/terms', [TermController::class, 'index']);
    Route::get('/holidays', [HolidayController::class, 'index']);
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::get('/submissions', [SubmissionController::class, 'index']);
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/messages', [MessageController::class, 'index']);

    // Parent portal (controllers verify the parent→child link).
    Route::get('/children', [ChildrenController::class, 'index']);
    Route::get('/child-results', [ChildResultsController::class, 'index']);
    Route::get('/child-attendance', [ChildAttendanceController::class, 'index']);
    Route::get('/emergency-contacts', [EmergencyContactController::class, 'index']);

    // Creator / marketplace (Course is creator-owned, NOT tenant-scoped).
    Route::get('/marketplace/courses', [CourseController::class, 'marketplace']);
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/revenue', [CourseController::class, 'revenue']);

    // ── Policy-gated writes (route needs only auth+tenant; controller authorizes) ──
    Route::post('/classes', [ClassController::class, 'store']);            // SchoolClassPolicy
    Route::post('/results', [ResultController::class, 'store']);            // ResultPolicy@create
    Route::post('/results/{id}/approve', [ResultController::class, 'approve']);
    Route::post('/results/{id}/publish', [ResultController::class, 'publish']);
    Route::post('/lessons', [LessonController::class, 'store']);            // LessonPolicy
    Route::post('/assignments', [AssignmentController::class, 'store']);    // AssignmentPolicy
    Route::post('/submissions', [SubmissionController::class, 'store']);    // SubmissionPolicy@create (student)
    Route::post('/submissions/{id}/grade', [SubmissionController::class, 'grade']); // SubmissionPolicy@grade
    Route::put('/courses/{id}', [CourseController::class, 'update']);        // CoursePolicy (owner)
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);    // CoursePolicy (owner)

    // Owned writes (current user is the actor; controller scopes to them).
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/emergency-contacts', [EmergencyContactController::class, 'store']);

    // ── Role-gated writes ──
    Route::middleware('role:school_admin,teacher')->group(function () {
        Route::post('/attendance', [AttendanceController::class, 'store']);
    });

    Route::middleware('role:creator')->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);
    });

    Route::middleware('role:school_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::post('/students', [StudentController::class, 'store']);
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::post('/assessment-configs', [AssessmentConfigController::class, 'store']);
        Route::post('/sessions', [SessionController::class, 'store']);
        Route::post('/sessions/{id}/set-current', [SessionController::class, 'setCurrent']);
        Route::post('/terms', [TermController::class, 'store']);
        Route::post('/terms/{id}/set-current', [TermController::class, 'setCurrent']);
        Route::post('/holidays', [HolidayController::class, 'store']);
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::post('/parent-links', [GuardianController::class, 'store']);
    });
});
