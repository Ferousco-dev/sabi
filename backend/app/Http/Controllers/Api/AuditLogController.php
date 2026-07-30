<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    /**
     * Audit log for the current school, newest first. Tenant isolation is
     * enforced by the BelongsToSchool global scope; write access is gated by the
     * `role:school_admin` middleware on the route.
     */
    public function index()
    {
        return AuditLog::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->paginate(50);
    }
}
