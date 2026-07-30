<?php

namespace App\Support;

/**
 * Holds the current request's tenant (school) id. Set once per request by the
 * ResolveTenant middleware, then read by the BelongsToSchool global scope.
 * Nothing else in the app should read school_id from the request directly.
 */
class Tenant
{
    protected static ?int $schoolId = null;

    public static function set(?int $schoolId): void
    {
        static::$schoolId = $schoolId;
    }

    public static function id(): ?int
    {
        return static::$schoolId;
    }
}
