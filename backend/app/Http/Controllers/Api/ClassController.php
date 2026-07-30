<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    // SchoolClass::all() is silently rewritten to
    //   WHERE school_id = <current school>
    // by the BelongsToSchool global scope. No tenant clause here on purpose.
    public function index()
    {
        return SchoolClass::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        // school_id is stamped automatically by the trait's creating hook.
        return response()->json(SchoolClass::create($data), 201);
    }
}
