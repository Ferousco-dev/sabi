<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class AssessmentConfig extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id', 'name', 'max_score', 'term',
    ];

    protected function casts(): array
    {
        return [
            'max_score' => 'integer',
        ];
    }
}
