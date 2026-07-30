<?php

namespace App\Models;

use App\Models\Concerns\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use BelongsToSchool;

    protected $fillable = ['school_id', 'created_by', 'title', 'body', 'target_role'];
}
