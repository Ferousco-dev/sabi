<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /** Exchange email + password for a Sanctum API token. */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Same message for both cases so we don't reveal which emails exist.
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'This account is not active.'], 403);
        }

        return [
            'token' => $user->createToken('api')->plainTextToken,
            'user' => $user->only('id', 'name', 'email', 'role', 'school_id'),
        ];
    }

    public function me(Request $request)
    {
        return $request->user()->only('id', 'name', 'email', 'role', 'school_id', 'status');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
