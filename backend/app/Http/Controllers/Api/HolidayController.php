<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index()
    {
        return Holiday::orderBy('date')->get();
    }

    public function store(Request $request)
    {
        // Write access is gated by the `role:school_admin` middleware on the route.
        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        return response()->json(Holiday::create($data), 201);
    }

    public function update(Request $request, int $id)
    {
        // findOrFail is tenant-scoped by the global scope.
        $holiday = Holiday::findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $holiday->update($data);

        return $holiday;
    }

    public function destroy(int $id)
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();

        return response()->json(null, 204);
    }
}
