<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    use BelongsToSchool;

    // Table is inferred as `campuses`.
    protected $fillable = ['school_id', 'name', 'address', 'city', 'state', 'phone', 'is_main'];

    protected $casts = [
        'is_main' => 'boolean',
    ];
}
