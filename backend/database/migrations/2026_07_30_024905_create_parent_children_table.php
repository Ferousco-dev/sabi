<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_children', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('child_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index('school_id');
            $table->unique(['school_id', 'parent_id', 'child_id'], 'parent_children_unique_link');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_children');
    }
};
