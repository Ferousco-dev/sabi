<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRecord extends Model
{
    use BelongsToSchool;

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    protected $fillable = [
        'school_id',
        'school_class_id',
        'student_id',
        'date',
        'status',
        'client_uuid',
        'recorded_by',
    ];

    // NOTE: `date` is intentionally NOT cast. A `date` cast stores as
    // "Y-m-d H:i:s", but updateOrCreate()'s idempotency lookup compares the bare
    // "Y-m-d" the client sends — the mismatch made replays insert duplicates.
    // Storing/querying the plain "Y-m-d" string keeps the upsert idempotent.
}
