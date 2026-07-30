<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SessionController extends Controller
{
    public function index()
    {
        return AcademicSession::orderByDesc('start_date')->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            // Session name is unique per school — another school may reuse "2025/2026".
            'name' => [
                'required', 'string', 'max:120',
                Rule::unique('academic_sessions', 'name')->where('school_id', $request->user()->school_id),
            ],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_current' => ['sometimes', 'boolean'],
        ]);

        $session = DB::transaction(function () use ($data) {
            $session = AcademicSession::create($data);

            if ($session->is_current) {
                $this->makeCurrent($session);
            }

            return $session;
        });

        return response()->json($session, 201);
    }

    public function setCurrent(int $id)
    {
        // Global scope keeps this lookup inside the current tenant.
        $session = AcademicSession::findOrFail($id);

        DB::transaction(fn () => $this->makeCurrent($session));

        return $session->fresh();
    }

    /**
     * Flip is_current to this session, unsetting any other current session in
     * the tenant. The update is auto-scoped by the BelongsToSchool global scope.
     */
    private function makeCurrent(AcademicSession $session): void
    {
        AcademicSession::where('is_current', true)
            ->whereKeyNot($session->getKey())
            ->update(['is_current' => false]);

        $session->forceFill(['is_current' => true])->save();
    }
}
