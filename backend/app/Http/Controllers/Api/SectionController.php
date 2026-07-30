<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        // Global scope filters to the current school; optional ?class_id narrows
        // to one class.
        return Section::query()
            ->when($request->query('class_id'), fn ($q, $classId) => $q->where('school_class_id', $classId))
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            // The class must belong to this tenant.
            'school_class_id' => [
                'required',
                Rule::exists('school_classes', 'id')->where('school_id', Tenant::id()),
            ],
        ]);

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Section::create($data), 201);
    }
}
