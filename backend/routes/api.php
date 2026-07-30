<?php

use App\Http\Controllers\Api\ClassController;
use App\Http\Middleware\ResolveTenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

// Public: exchange email + password for a Sanctum token.
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    return ['token' => $user->createToken('api')->plainTextToken];
});

// Everything here requires a valid token (auth:sanctum) AND is pinned to the
// caller's school (ResolveTenant). Order matters: authenticate first, then
// resolve the tenant from the authenticated user.
Route::middleware(['auth:sanctum', ResolveTenant::class])->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::get('/classes', [ClassController::class, 'index']);
    Route::post('/classes', [ClassController::class, 'store']);
});
