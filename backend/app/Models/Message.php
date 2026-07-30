<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use BelongsToSchool;

    protected $fillable = ['school_id', 'sender_id', 'recipient_id', 'subject', 'body', 'read_at'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
