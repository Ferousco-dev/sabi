<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;

/**
 * Policy for Submission. Auto-discovered by name.
 * Students create their own submissions; teachers/admins grade them.
 * Tenancy is handled by the global scope.
 */
class SubmissionPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // controller narrows a student to only their own rows
    }

    public function create(User $user): bool
    {
        return $user->hasRole('student');
    }

    public function grade(User $user, Submission $submission): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }
}
