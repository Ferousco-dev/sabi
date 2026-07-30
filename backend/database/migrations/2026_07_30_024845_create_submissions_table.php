<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assignment_id')->constrained('assignments')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->text('content')->nullable();
            $table->string('file_url')->nullable();
            $table->string('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index('school_id');
            // One submission per student per assignment, scoped to the tenant.
            $table->unique(['school_id', 'assignment_id', 'student_id'], 'submissions_unique_per_student');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
