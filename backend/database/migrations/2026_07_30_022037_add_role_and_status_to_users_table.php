<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // role: school_admin | teacher | student | parent | creator
            $table->string('role')->default('student')->after('email');
            // status: active | inactive | graduated | expelled | transferred
            $table->string('status')->default('active')->after('role');
            $table->index(['school_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['school_id', 'role']);
            $table->dropColumn(['role', 'status']);
        });
    }
};
