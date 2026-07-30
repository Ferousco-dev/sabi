<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index()
    {
        // Global scope rewrites this to WHERE school_id = <current school>.
        return SchoolClass::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // Policy check: only a school_admin may create. Tenancy is separate and
        // already automatic — this is the "who is allowed" layer.
        $this->authorize('create', SchoolClass::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(SchoolClass::create($data), 201);
    }
}
