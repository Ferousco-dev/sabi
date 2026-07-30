<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A marketplace course.
 *
 * IMPORTANT: Course is intentionally NOT tenant-scoped — it deliberately does
 * NOT use BelongsToSchool. Courses live on a cross-school marketplace and are
 * owned by their creator (a User with role=creator). Creator-management
 * endpoints scope explicitly by creator_id; the marketplace listing is global.
 */
class Course extends Model
{
    protected $fillable = [
        'creator_id', 'title', 'description', 'price', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_published' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
