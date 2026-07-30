<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssessmentConfig;
use Illuminate\Http\Request;

class AssessmentConfigController extends Controller
{
    public function index()
    {
        // Global scope rewrites this to WHERE school_id = <current school>.
        return AssessmentConfig::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'max_score' => ['sometimes', 'integer', 'min:1'],
            'term' => ['nullable', 'string', 'max:60'],
        ]);

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(AssessmentConfig::create($data), 201);
    }
}
