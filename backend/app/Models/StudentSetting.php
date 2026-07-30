<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSetting extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'user_id',
        'notify_email',
        'notify_sms',
        'notify_push',
        'high_contrast',
        'large_text',
        'reduce_motion',
    ];

    protected function casts(): array
    {
        return [
            'notify_email' => 'boolean',
            'notify_sms' => 'boolean',
            'notify_push' => 'boolean',
            'high_contrast' => 'boolean',
            'large_text' => 'boolean',
            'reduce_motion' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
