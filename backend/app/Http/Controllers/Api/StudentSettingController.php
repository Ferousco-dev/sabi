<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentSetting;
use Illuminate\Http\Request;

class StudentSettingController extends Controller
{
    /**
     * The current user's settings row, creating a default one if none exists.
     * Tenancy: school_id is auto-scoped on read and auto-stamped on create by
     * the BelongsToSchool trait, so we only ever key on the current user_id.
     */
    public function show(Request $request)
    {
        // Always 200: a settings read is not a resource creation, even when we
        // lazily create the default row (returning a just-created model would
        // otherwise make Laravel respond 201).
        return response()->json($this->settingsFor($request), 200);
    }

    /**
     * Update the current user's settings. Booleans only.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'notify_email' => ['sometimes', 'boolean'],
            'notify_sms' => ['sometimes', 'boolean'],
            'notify_push' => ['sometimes', 'boolean'],
            'high_contrast' => ['sometimes', 'boolean'],
            'large_text' => ['sometimes', 'boolean'],
            'reduce_motion' => ['sometimes', 'boolean'],
        ]);

        $settings = $this->settingsFor($request);
        $settings->update($data);

        return response()->json($settings, 200);
    }

    /**
     * Fetch-or-create the current user's row. firstOrCreate keys on user_id only;
     * school_id is stamped by the trait's creating hook and scopes the read.
     */
    private function settingsFor(Request $request): StudentSetting
    {
        // refresh() reloads DB-default booleans that firstOrCreate leaves unset
        // on the in-memory model, so the response always includes every field.
        return StudentSetting::firstOrCreate(['user_id' => $request->user()->id])->refresh();
    }
}
