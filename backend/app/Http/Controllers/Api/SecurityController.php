<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Tenant;
use Laravel\Sanctum\PersonalAccessToken;

class SecurityController extends Controller
{
    /**
     * Active login sessions for the current school: Sanctum personal access
     * tokens whose owner is a user in this tenant. User has no global scope, so
     * we constrain to this school's users explicitly. Write access is gated by
     * the `role:school_admin` middleware on the route.
     */
    public function sessions()
    {
        return PersonalAccessToken::query()
            ->where('tokenable_type', User::class)
            ->whereIn('tokenable_id', $this->schoolUserIds())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PersonalAccessToken $token) => [
                'id' => $token->id,
                'name' => $token->name,
                'user_name' => $token->tokenable?->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
            ]);
    }

    /**
     * Revoke (delete) a session token — only if it belongs to a user in this
     * school. Otherwise 404, so a token in another tenant is indistinguishable
     * from one that does not exist.
     */
    public function revoke(string $tokenId)
    {
        $token = PersonalAccessToken::query()
            ->where('id', $tokenId)
            ->where('tokenable_type', User::class)
            ->whereIn('tokenable_id', $this->schoolUserIds())
            ->first();

        if (! $token) {
            abort(404);
        }

        $token->delete();

        return response()->json(['message' => 'Session revoked.']);
    }

    /** IDs of users belonging to the current tenant. */
    private function schoolUserIds(): \Illuminate\Database\Eloquent\Builder
    {
        return User::query()
            ->select('id')
            ->where('school_id', Tenant::id());
    }
}
