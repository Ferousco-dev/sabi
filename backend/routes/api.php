<?php

use App\Http\Controllers\Api\AssessmentConfigController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherController;
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

    // Reads: any authenticated user in the tenant. Some indexes filter further
    // by role inside the controller (e.g. a student sees only their own results).
    Route::get('/classes', [ClassController::class, 'index']);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/timetable', [TimetableController::class, 'index']);
    Route::get('/enrollments', [EnrollmentController::class, 'index']);
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::get('/assessment-configs', [AssessmentConfigController::class, 'index']);
    Route::get('/results', [ResultController::class, 'index']);

    // Policy-gated writes (route needs only auth+tenant; controller authorizes).
    Route::post('/classes', [ClassController::class, 'store']);          // SchoolClassPolicy
    Route::post('/results', [ResultController::class, 'store']);          // ResultPolicy@create (teacher|admin)
    Route::post('/results/{id}/approve', [ResultController::class, 'approve']); // ResultPolicy@approve (admin)
    Route::post('/results/{id}/publish', [ResultController::class, 'publish']); // ResultPolicy@publish (admin)

    // Attendance write: teacher OR admin.
    Route::middleware('role:school_admin,teacher')->group(function () {
        Route::post('/attendance', [AttendanceController::class, 'store']);
    });

    // Admin-only writes.
    Route::middleware('role:school_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::post('/students', [StudentController::class, 'store']);
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::post('/assessment-configs', [AssessmentConfigController::class, 'store']);
    });
});
