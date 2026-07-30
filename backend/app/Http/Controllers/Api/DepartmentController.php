<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index()
    {
        // Global scope on `departments` filters to the current school. The join
        // to users surfaces the head teacher's name without an extra query.
        return Department::query()
            ->leftJoin('users', 'departments.head_teacher_id', '=', 'users.id')
            ->orderBy('departments.name')
            ->get([
                'departments.*',
                'users.name as head_teacher_name',
            ]);
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            // The head teacher must belong to this tenant.
            'head_teacher_id' => [
                'nullable',
                Rule::exists('users', 'id')->where('school_id', Tenant::id()),
            ],
        ]);

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Department::create($data), 201);
    }
}
