<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id', 'title', 'date', 'description',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
