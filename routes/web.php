<?php

use App\Http\Controllers\TaskController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [TaskController::class, 'dashboard'])->name('dashboard');

// Tasks routes
Route::resource('tasks', TaskController::class);
Route::post('tasks/{task}/toggle', [TaskController::class, 'toggleStatus'])->name('tasks.toggle');
Route::post('tasks/{task}/progress', [TaskController::class, 'updateProgress'])->name('tasks.progress');

// Report routes
Route::get('tasks/report/daily', [TaskController::class, 'generateDailyReport'])->name('tasks.report.daily');
Route::get('tasks/report/weekly', [TaskController::class, 'generateWeeklyReport'])->name('tasks.report.weekly');
Route::get('tasks/report', [TaskController::class, 'generateReport'])->name('tasks.report');

Route::get('/analytics', function () {
    return Inertia::render('Analytics', [
        'tasks' => App\Models\Task::orderBy('due_date', 'desc')->get()
    ]);
});

Route::get('/settings', function () {
    return Inertia::render('Settings');
});

require __DIR__.'/auth.php';
