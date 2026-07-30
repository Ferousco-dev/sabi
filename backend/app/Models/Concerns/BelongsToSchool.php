<?php

namespace App\Models\Concerns;

use App\Models\School;
use App\Support\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Add `use BelongsToSchool;` to any model whose table has a `school_id`.
 * It does two things automatically for the current tenant:
 *
 *   1. GLOBAL SCOPE — every SELECT gets `WHERE school_id = <current school>`
 *      injected by the framework. Callers never write that clause, and
 *      therefore cannot forget it. This is what makes isolation a guarantee
 *      rather than a convention.
 *
 *   2. CREATING HOOK — every new row gets school_id stamped from the current
 *      tenant, so inserts land in the right school without the caller passing it.
 *
 * `boot{TraitName}` is a Laravel convention: Eloquent calls it automatically
 * when the model boots.
 */
trait BelongsToSchool
{
    protected static function bootBelongsToSchool(): void
    {
        static::addGlobalScope('school', function (Builder $builder) {
            if ($id = Tenant::id()) {
                $builder->where($builder->getModel()->getTable() . '.school_id', $id);
            }
        });

        static::creating(function ($model) {
            if (empty($model->school_id) && ($id = Tenant::id())) {
                $model->school_id = $id;
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
