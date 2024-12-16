<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    private $projectTasks = [
        'Backend Development' => [
            'API Implementation' => [
                'Create User Authentication Endpoints',
                'Implement Data Validation',
                'Set up Database Migrations'
            ],
            'Database Optimization' => [
                'Index Critical Columns',
                'Optimize Query Performance',
                'Implement Caching Strategy'
            ]
        ],
        'Frontend Development' => [
            'UI Components' => [
                'Design Dashboard Layout',
                'Create Reusable Form Components',
                'Implement Data Tables'
            ],
            'User Experience' => [
                'Add Loading States',
                'Implement Error Handling',
                'Optimize Page Load Time'
            ]
        ],
        'Project Management' => [
            'Documentation' => [
                'Update API Documentation',
                'Create User Manual',
                'Document Code Standards'
            ],
            'Team Coordination' => [
                'Weekly Team Meetings',
                'Code Review Sessions',
                'Sprint Planning'
            ]
        ]
    ];

    private $difficulties = [
        'Integration with legacy systems required additional workarounds',
        'Complex data relationships needed careful optimization',
        'Cross-browser compatibility issues needed extensive testing',
        'Performance bottlenecks required thorough investigation',
        'Security vulnerabilities needed immediate attention',
        'Team coordination across different time zones was challenging',
        'Technical debt needed to be addressed while maintaining feature development',
        'Resource constraints required creative solutions',
    ];

    private $solutions = [
        'Implemented adapter pattern to handle legacy system integration',
        'Created efficient database indexes and optimized queries',
        'Developed comprehensive test suite for cross-browser testing',
        'Used profiling tools to identify and fix performance issues',
        'Conducted security audit and implemented necessary patches',
        'Set up automated workflows and communication channels',
        'Established technical debt tracking and resolution process',
        'Prioritized tasks and optimized resource allocation',
    ];

    private $notes = [
        'Regular monitoring needed to ensure continued performance',
        'Documentation updated to reflect new changes',
        'Additional training may be required for team members',
        'Consider implementing automated testing',
        'Future scalability should be considered',
        'Positive feedback received from stakeholders',
        'Regular maintenance schedule established',
        'Knowledge transfer sessions completed',
    ];

    public function run()
    {
        $startDate = Carbon::now()->startOfWeek();

        foreach ($this->projectTasks as $mainProject => $subProjects) {
            // Create main project task
            $mainTask = Task::create([
                'title' => $mainProject,
                'description' => "Main project: $mainProject",
                'status' => $this->randomStatus(),
                'priority' => $this->randomPriority(),
                'progress_percentage' => random_int(0, 100),
                'due_date' => $startDate->copy()->addDays(random_int(0, 6)),
                'difficulties' => $this->difficulties[array_rand($this->difficulties)],
                'solutions' => $this->solutions[array_rand($this->solutions)],
                'notes' => $this->notes[array_rand($this->notes)],
            ]);

            foreach ($subProjects as $subProject => $tasks) {
                // Create sub-project task
                $subTask = Task::create([
                    'title' => $subProject,
                    'description' => "Sub-project: $subProject under $mainProject",
                    'status' => $this->randomStatus(),
                    'priority' => $this->randomPriority(),
                    'progress_percentage' => random_int(0, 100),
                    'due_date' => $startDate->copy()->addDays(random_int(0, 6)),
                    'difficulties' => $this->difficulties[array_rand($this->difficulties)],
                    'solutions' => $this->solutions[array_rand($this->solutions)],
                    'notes' => $this->notes[array_rand($this->notes)],
                    'parent_task_id' => $mainTask->id,
                ]);

                foreach ($tasks as $task) {
                    // Create individual tasks
                    Task::create([
                        'title' => $task,
                        'description' => "Task: $task under $subProject",
                        'status' => $this->randomStatus(),
                        'priority' => $this->randomPriority(),
                        'progress_percentage' => random_int(0, 100),
                        'due_date' => $startDate->copy()->addDays(random_int(0, 6)),
                        'difficulties' => $this->difficulties[array_rand($this->difficulties)],
                        'solutions' => $this->solutions[array_rand($this->solutions)],
                        'notes' => $this->notes[array_rand($this->notes)],
                        'parent_task_id' => $subTask->id,
                    ]);
                }
            }
        }
    }

    private function randomStatus()
    {
        return ['not-started', 'in-progress', 'completed'][array_rand([0, 1, 2])];
    }

    private function randomPriority()
    {
        return ['low', 'medium', 'high'][array_rand([0, 1, 2])];
    }
}
