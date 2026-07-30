<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

/**
 * Policy for Course. Auto-discovered by name (Course -> CoursePolicy).
 *
 * Courses are not tenant-scoped, so there is no school global scope to lean on.
 * Ownership is the authorization boundary: only the owning creator may update or
 * delete a course.
 */
class CoursePolicy
{
    public function update(User $user, Course $course): bool
    {
        return $course->creator_id === $user->id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $course->creator_id === $user->id;
    }
}
