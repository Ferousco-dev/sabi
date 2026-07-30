<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * The current user's own notifications. Tenancy is automatic via the global
     * scope; ownership is filtered explicitly by user_id.
     */
    public function index(Request $request)
    {
        return Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Mark one of the current user's notifications as read. Scoped to the owner
     * so another user's id 404s (tenant scope + explicit user_id filter).
     */
    public function markRead(Request $request, string $id)
    {
        $notification = Notification::query()
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($notification->read_at === null) {
            $notification->update(['read_at' => now()]);
        }

        return $notification;
    }
}
