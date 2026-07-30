<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use App\Support\Tenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class AuditLog extends Model
{
    use BelongsToSchool;

    /** Only a created_at column exists — there is no updated_at to maintain. */
    const UPDATED_AT = null;

    protected $fillable = ['school_id', 'user_id', 'action', 'resource', 'details', 'ip_address'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record an audit entry for the current tenant, stamping the acting user and
     * request IP when they are available. school_id is stamped by BelongsToSchool.
     */
    public static function record(string $action, ?string $resource = null, ?string $details = null): self
    {
        return static::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'resource' => $resource,
            'details' => $details,
            'ip_address' => request()?->ip(),
            'school_id' => Tenant::id(),
        ]);
    }
}
