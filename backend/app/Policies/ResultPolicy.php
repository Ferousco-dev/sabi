<?php

namespace App\Policies;

use App\Models\Result;
use App\Models\User;

/**
 * Policy for Result. Auto-discovered by name (Result -> ResultPolicy).
 * Tenancy is handled by the global scope; this adds the approval-flow
 * authorization: teachers submit, only admins approve/publish.
 */
class ResultPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // further filtered by role in the controller
    }

    public function create(User $user): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }

    public function approve(User $user, Result $result): bool
    {
        return $user->hasRole('school_admin');
    }

    public function publish(User $user, Result $result): bool
    {
        return $user->hasRole('school_admin');
    }
}
