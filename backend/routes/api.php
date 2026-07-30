<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TimetableController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ResolveTenant;
use Illuminate\Support\Facades\Route;

// ── Public ────────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/invitations/accept', [InvitationController::class, 'accept']);

// ── Authenticated + tenant-scoped ───────────────────────────────────────────
// auth:sanctum proves who you are; ResolveTenant pins you to your school.
Route::middleware(['auth:sanctum', ResolveTenant::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Reads: any authenticated user in the tenant.
    Route::get('/classes', [ClassController::class, 'index']);
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/timetable', [TimetableController::class, 'index']);

    // Classes: writes gated by SchoolClassPolicy (inside the controller).
    Route::post('/classes', [ClassController::class, 'store']);

    // Admin-only writes: coarse `role` middleware.
    Route::middleware('role:school_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::post('/invitations', [InvitationController::class, 'store']);
    });
});
