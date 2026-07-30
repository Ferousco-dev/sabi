<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

/**
 * Policy for Lesson. Auto-discovered by name (Lesson -> LessonPolicy).
 * Tenancy is handled by the global scope; this gates authoring to
 * teachers and school admins.
 */
class LessonPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // any authenticated user in the tenant may read lessons
    }

    public function create(User $user): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }

    public function update(User $user, Lesson $lesson): bool
    {
        return $user->hasRole('teacher', 'school_admin');
    }
}
