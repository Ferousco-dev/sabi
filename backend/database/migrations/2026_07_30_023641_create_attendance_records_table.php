<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->string('status'); // present|absent|late|excused
            // Client-generated id for offline replay dedupe (ADR-0004). The real
            // idempotency key is (school_id, student_id, date) below; this is kept
            // for audit/traceability of which offline mutation produced the row.
            $table->string('client_uuid')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // ONE record per student per day (per tenant). This is also the upsert
            // key that makes replaying the same offline batch idempotent.
            $table->unique(['school_id', 'student_id', 'date']);
            $table->index(['school_id', 'school_class_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};
