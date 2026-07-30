<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->string('short_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('website')->nullable();
            $table->string('motto')->nullable();
            $table->string('founded_year')->nullable();
            $table->string('school_type')->default('K-12');
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn([
                'short_name', 'email', 'phone', 'address', 'city', 'state',
                'country', 'logo_url', 'website', 'motto', 'founded_year', 'school_type',
            ]);
        });
    }
};
