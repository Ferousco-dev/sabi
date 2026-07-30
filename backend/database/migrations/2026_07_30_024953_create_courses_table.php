<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * NOTE: Courses are intentionally NOT school-scoped. A Course is owned by its
     * creator (a User with role=creator) and sold on a cross-school marketplace,
     * so there is deliberately no school_id column here and the Course model does
     * NOT use BelongsToSchool. Ownership is enforced explicitly via creator_id.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2)->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index('creator_id');
            $table->index('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
