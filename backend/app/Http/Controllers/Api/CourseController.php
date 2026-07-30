<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

/**
 * Courses live on a cross-school marketplace and are NOT tenant-scoped (Course
 * does not use BelongsToSchool). Ownership is the boundary instead of tenancy:
 * creator-management endpoints filter explicitly by creator_id, and the public
 * marketplace listing is global.
 */
class CourseController extends Controller
{
    /**
     * The current creator's own courses. Explicitly scoped by creator_id since
     * there is no tenant global scope on Course.
     */
    public function index(Request $request)
    {
        return Course::query()
            ->where('creator_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Create a course owned by the current creator. The route is gated by the
     * `role:creator` middleware; creator_id is stamped from the auth id and is
     * never taken from request input.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $data['creator_id'] = $request->user()->id;

        return response()->json(Course::create($data), 201);
    }

    /**
     * Update a course. Only the owning creator may do so (CoursePolicy@update).
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);
        $this->authorize('update', $course);

        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $course->update($data);

        return $course;
    }

    /**
     * Delete a course. Only the owning creator may do so (CoursePolicy@delete).
     */
    public function destroy(string $id)
    {
        $course = Course::findOrFail($id);
        $this->authorize('delete', $course);

        $course->delete();

        return response()->noContent();
    }

    /**
     * Public marketplace listing — global across all schools/creators, published
     * courses only. Any authenticated user may browse.
     */
    public function marketplace()
    {
        return Course::query()
            ->where('is_published', true)
            ->orderByDesc('id')
            ->paginate(20);
    }

    /**
     * Best-effort revenue summary for the current creator's courses.
     *
     * LIMITATIONS: there is no enrollments/sales table yet, so this cannot report
     * actual earnings. It returns simple catalogue aggregates only — a count of
     * published courses and the summed list price of the creator's courses.
     */
    public function revenue(Request $request)
    {
        $courses = Course::query()->where('creator_id', $request->user()->id);

        return response()->json([
            'total_courses' => (clone $courses)->count(),
            'published_courses' => (clone $courses)->where('is_published', true)->count(),
            'total_list_price' => (float) (clone $courses)->sum('price'),
            'note' => 'Best-effort catalogue aggregates only; no sales/enrollment data yet.',
        ]);
    }
}
