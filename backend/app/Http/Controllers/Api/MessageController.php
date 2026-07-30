<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Support\Tenant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{
    /**
     * Messages the current user is a party to (sender OR recipient). Tenancy is
     * automatic via the global scope.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        return Message::query()
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                    ->orWhere('recipient_id', $userId);
            })
            ->orderByDesc('id')
            ->get();
    }

    /**
     * Send a message. Sender is the current user; the recipient must belong to
     * the same tenant (enforced by the scoped exists rule).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'recipient_id' => [
                'required', 'integer',
                Rule::exists('users', 'id')->where('school_id', Tenant::id()),
            ],
            'subject' => ['nullable', 'string', 'max:200'],
            'body' => ['required', 'string'],
        ]);

        $data['sender_id'] = $request->user()->id;

        // school_id stamped automatically by the trait's creating hook.
        return response()->json(Message::create($data), 201);
    }
}
