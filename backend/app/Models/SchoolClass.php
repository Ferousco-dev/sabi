<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    // Table is inferred as `school_classes`. This one line is all a model needs
    // to become fully tenant-isolated.
    use BelongsToSchool;

    protected $fillable = ['school_id', 'name'];
}
