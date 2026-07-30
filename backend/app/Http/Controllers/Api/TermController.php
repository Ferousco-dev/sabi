<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use App\Models\Term;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TermController extends Controller
{
    public function index(Request $request)
    {
        $query = Term::orderBy('start_date');

        if ($sessionId = $request->query('session_id')) {
            $query->where('academic_session_id', $sessionId);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'academic_session_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:120'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_current' => ['sometimes', 'boolean'],
        ]);

        // Confirm the parent session belongs to this tenant (global scope enforced).
        AcademicSession::findOrFail($data['academic_session_id']);

        $term = DB::transaction(function () use ($data) {
            $term = Term::create($data);

            if ($term->is_current) {
                $this->makeCurrent($term);
            }

            return $term;
        });

        return response()->json($term, 201);
    }

    public function setCurrent(int $id)
    {
        // Global scope keeps this lookup inside the current tenant.
        $term = Term::findOrFail($id);

        DB::transaction(fn () => $this->makeCurrent($term));

        return $term->fresh();
    }

    /**
     * Flip is_current to this term, unsetting any other current term in the
     * tenant. The update is auto-scoped by the BelongsToSchool global scope.
     */
    private function makeCurrent(Term $term): void
    {
        Term::where('is_current', true)
            ->whereKeyNot($term->getKey())
            ->update(['is_current' => false]);

        $term->forceFill(['is_current' => true])->save();
    }
}
