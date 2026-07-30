<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentChild;
use App\Models\Result;
use Illuminate\Http\Request;

class ChildResultsController extends Controller
{
    /**
     * PUBLISHED results for one of the authenticated parent's linked children.
     * The link is verified first (403 if the child is not theirs). Tenancy is
     * automatic: ParentChild and Result both carry the BelongsToSchool global
     * scope, so a cross-tenant child_id simply fails the link check.
     */
    public function index(Request $request)
    {
        $data = $request->validate([
            'child_id' => ['required', 'integer'],
        ]);

        $isLinked = ParentChild::query()
            ->where('parent_id', $request->user()->id)
            ->where('child_id', $data['child_id'])
            ->exists();

        abort_unless($isLinked, 403, 'This is not your child.');

        return Result::query()
            ->where('student_id', $data['child_id'])
            ->where('status', 'published')
            ->orderByDesc('id')
            ->get();
    }
}
