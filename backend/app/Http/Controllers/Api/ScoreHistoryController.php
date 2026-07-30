<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;

class ScoreHistoryController extends Controller
{
    /**
     * The authenticated user's own PUBLISHED results, grouped by subject.
     *
     * Tenancy is automatic via the BelongsToSchool global scope on Result;
     * we further constrain to the current user's published rows. No new table —
     * this is derived from results + subjects + assessment_configs.
     *
     * Shape: [{ subject, scores: [{ assessment, score, max }] }]
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $results = Result::with(['subject', 'assessment'])
            ->where('student_id', $user->id)
            ->where('status', 'published')
            ->orderBy('subject_id')
            ->orderBy('id')
            ->get();

        return $results
            ->groupBy('subject_id')
            ->map(fn ($rows) => [
                'subject' => optional($rows->first()->subject)->name,
                'scores' => $rows->map(fn (Result $r) => [
                    'assessment' => optional($r->assessment)->name,
                    'score' => $r->score,
                    'max' => optional($r->assessment)->max_score,
                ])->values(),
            ])
            ->values();
    }
}
