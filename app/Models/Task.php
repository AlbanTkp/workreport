<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'progress_percentage',
        'due_date',
        'difficulties',
        'solutions',
        'notes'
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function subtasks()
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }
}
