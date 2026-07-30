<?php

namespace App\Policies;

use App\Models\SchoolClass;
use App\Models\User;

/**
 * Policy for SchoolClass. Laravel auto-discovers it by name (SchoolClass ->
 * SchoolClassPolicy), so no registration is needed. Tenancy is already handled
 * by the global scope; a policy adds the *who is allowed to do what* layer on top.
 *
 * Rule: anyone in the school can view classes; only the admin can change them.
 */
class SchoolClassPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // any authenticated user (already tenant-scoped)
    }

    public function create(User $user): bool
    {
        return $user->hasRole('school_admin');
    }

    public function update(User $user, SchoolClass $class): bool
    {
        return $user->hasRole('school_admin');
    }

    public function delete(User $user, SchoolClass $class): bool
    {
        return $user->hasRole('school_admin');
    }
}
