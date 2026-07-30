<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campus;
use Illuminate\Http\Request;

class CampusController extends Controller
{
    public function index()
    {
        // Global scope rewrites this to WHERE school_id = <current school>.
        return Campus::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_main' => ['sometimes', 'boolean'],
        ]);

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Campus::create($data), 201);
    }

    public function destroy($id)
    {
        // findOrFail is tenant-scoped by the global scope, so a school can only
        // ever delete its own campuses.
        $campus = Campus::findOrFail($id);
        $campus->delete();

        return response()->json(null, 204);
    }
}
