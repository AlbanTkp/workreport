<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['not-started', 'in-progress', 'completed'])->default('not-started');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->integer('progress_percentage')->default(0);
            $table->date('due_date');
            $table->text('difficulties')->nullable();
            $table->text('solutions')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('parent_task_id')->nullable()->references('id')->on('tasks')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->text('difficulties')->nullable();
            $table->text('solutions')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
        Schema::dropIfExists('tasks');
    }
};
