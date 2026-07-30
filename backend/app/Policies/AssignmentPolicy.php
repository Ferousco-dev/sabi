<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\User;

/**
 * Policy for Assignment. Auto-discovered by name.
 * Authoring is gated to teachers and school admins; tenancy is automatic.
 */
class AssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // any authenticated user in the tenant may read assignments
    }

    public function create(User $user): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }

    public function update(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }
}
