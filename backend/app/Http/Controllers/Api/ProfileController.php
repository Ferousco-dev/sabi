<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Support\Tenant;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * The current tenant's school profile. School is the tenant ROOT and is not
     * itself BelongsToSchool-scoped, so we resolve it explicitly by Tenant::id().
     */
    public function show()
    {
        return School::findOrFail(Tenant::id());
    }

    /**
     * Update the current tenant's school profile. Admin only (route middleware).
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'short_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'logo_url' => ['nullable', 'string', 'max:2048'],
            'website' => ['nullable', 'string', 'max:2048'],
            'motto' => ['nullable', 'string', 'max:255'],
            'founded_year' => ['nullable', 'string', 'max:10'],
            'school_type' => ['sometimes', 'string', 'max:50'],
        ]);

        $school = School::findOrFail(Tenant::id());
        $school->update($data);

        return response()->json($school, 200);
    }
}
