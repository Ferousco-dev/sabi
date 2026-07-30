<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use BelongsToSchool;

    protected $fillable = ['school_id', 'user_id', 'title', 'body', 'type', 'read_at'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
