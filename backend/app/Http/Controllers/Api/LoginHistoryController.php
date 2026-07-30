<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoginHistory;

class LoginHistoryController extends Controller
{
    /**
     * Login history for the current school, newest first. Tenant isolation is
     * enforced by the BelongsToSchool global scope; write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function index()
    {
        return LoginHistory::with('user:id,name,email')
            ->orderByDesc('logged_in_at')
            ->paginate(50);
    }
}
