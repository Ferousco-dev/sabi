<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('assessment_config_id')->constrained('assessment_configs')->cascadeOnDelete();
            $table->decimal('score', 5, 2);
            $table->string('grade')->nullable();
            $table->string('status')->default('pending'); // pending|approved|published
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('school_id');
            $table->unique(['school_id', 'assessment_config_id', 'student_id', 'subject_id'], 'results_unique_per_assessment');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
