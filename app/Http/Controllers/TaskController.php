<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();

        // Apply search filter
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('due_date', [$request->start_date, $request->end_date]);
        }

        $tasks = $query->orderBy('due_date', 'desc')->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $request->all(['search', 'start_date', 'end_date']),
            'weeklyStats' => $this->getWeeklyStats()
        ]);
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard', [
            'tasks' => Task::with('subtasks')
                ->orderBy('due_date', 'desc')
                ->get()
                ->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status,
                        'progress' => $task->progress,
                        'due_date' => $task->due_date,
                        'subtasks' => $task->subtasks,
                        'created_at' => $task->created_at,
                        'updated_at' => $task->updated_at,
                    ];
                }),
            'weeklyStats' => $this->getWeeklyStats()
        ]);
    }

    private function getWeeklyStats()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        
        $tasks = Task::whereBetween('due_date', [$startOfWeek, $endOfWeek])->get();
        
        return [
            'total' => $tasks->count(),
            'completed' => $tasks->where('status', 'completed')->count(),
            'inProgress' => $tasks->where('status', 'in_progress')->count(),
            'notStarted' => $tasks->where('status', 'not_started')->count(),
            'labels' => [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
                'Friday', 'Saturday', 'Sunday'
            ],
            'datasets' => [
                [
                    'label' => 'Completed',
                    'data' => $tasks->where('status', 'completed')->count(),
                    'borderColor' => '#10B981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)'
                ],
                [
                    'label' => 'In Progress',
                    'data' => $tasks->where('status', 'in_progress')->count(),
                    'borderColor' => '#F59E0B',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.1)'
                ],
                [
                    'label' => 'Not Started',
                    'data' => $tasks->where('status', 'not_started')->count(),
                    'borderColor' => '#EF4444',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.1)'
                ]
            ]
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:not-started,in-progress,completed',
            'priority' => 'required|in:low,medium,high',
            'progress_percentage' => 'required|integer|min:0|max:100',
            'due_date' => 'required|date',
            'difficulties' => 'nullable|string',
            'solutions' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $task = Task::create($validated);

        return redirect()->back()->with('success', 'Task created successfully');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:not-started,in-progress,completed',
            'priority' => 'required|in:low,medium,high',
            'progress_percentage' => 'required|integer|min:0|max:100',
            'due_date' => 'required|date',
            'difficulties' => 'nullable|string',
            'solutions' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task updated successfully');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back();
    }

    public function generateDailyReport(Request $request)
    {
        $today = Carbon::today();
        $tasks = Task::whereDate('due_date', $today)
            ->with('subtasks')
            ->get();

        $data = [
            'date' => $today->format('F d, Y'),
            'tasks' => $tasks,
            'completed' => $tasks->where('status', 'completed')->count(),
            'inProgress' => $tasks->where('status', 'in_progress')->count(),
            'notStarted' => $tasks->where('status', 'not_started')->count(),
        ];

        $pdf = PDF::loadView('pdf.tasks.daily', $data);
        
        if ($request->boolean('download')) {
            return $pdf->download('daily-report-' . $today->format('Y-m-d') . '.pdf');
        }
        if ($request->boolean('json')) {
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf');
        }

        return Inertia::render('Reports/PDFViewer', [
            'title' => 'Daily Task Report - ' . $today->format('F d, Y'),
            'pdfUrl' => route('tasks.report.daily', ['json' => true])
        ]);
    }

    public function generateWeeklyReport(Request $request)
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        
        $tasks = Task::whereBetween('due_date', [$startOfWeek, $endOfWeek])
            ->with('subtasks')
            ->get();

        $data = [
            'startDate' => $startOfWeek->format('F d, Y'),
            'endDate' => $endOfWeek->format('F d, Y'),
            'tasks' => $tasks,
            'completed' => $tasks->where('status', 'completed')->count(),
            'inProgress' => $tasks->where('status', 'in_progress')->count(),
            'notStarted' => $tasks->where('status', 'not_started')->count(),
        ];

        $pdf = PDF::loadView('pdf.tasks.weekly', $data);
        
        if ($request->boolean('download')) {
            return $pdf->download('weekly-report-' . $startOfWeek->format('Y-m-d') . '.pdf');
        }

        if ($request->boolean('json')) {
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf');
        }

        return Inertia::render('Reports/PDFViewer', [
            'title' => 'Weekly Task Report - ' . $startOfWeek->format('F d, Y'),
            'pdfUrl' => route('tasks.report.weekly', ['json' => true])
        ]);
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'type' => 'required|in:daily,weekly',
            'start_date' => 'required|date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        
        if ($request->type === 'daily') {
            $tasks = Task::whereDate('due_date', $startDate)
                ->with('subtasks')
                ->get();
            
            $data = [
                'date' => $startDate->format('F d, Y'),
                'tasks' => $tasks,
                'completed' => $tasks->where('status', 'completed')->count(),
                'inProgress' => $tasks->where('status', 'in_progress')->count(),
                'notStarted' => $tasks->where('status', 'not_started')->count(),
            ];

            $pdf = PDF::loadView('pdf.tasks.daily', $data);
            $title = 'Daily Task Report - ' . $startDate->format('F d, Y');
            $filename = 'daily-report-' . $startDate->format('Y-m-d') . '.pdf';
            $pdfUrl = route('tasks.report', array_merge($request->all(), ['json' => true]));
        } else {
            $endDate = $startDate->copy()->endOfWeek();
            $tasks = Task::whereBetween('due_date', [$startDate, $endDate])
                ->with('subtasks')
                ->get();
            
            $data = [
                'startDate' => $startDate->format('F d, Y'),
                'endDate' => $endDate->format('F d, Y'),
                'tasks' => $tasks,
                'completed' => $tasks->where('status', 'completed')->count(),
                'inProgress' => $tasks->where('status', 'in_progress')->count(),
                'notStarted' => $tasks->where('status', 'not_started')->count(),
            ];

            $pdf = PDF::loadView('pdf.tasks.weekly', $data);
            $title = 'Weekly Task Report - ' . $startDate->format('F d, Y');
            $filename = 'weekly-report-' . $startDate->format('Y-m-d') . '.pdf';
            $pdfUrl = route('tasks.report', array_merge($request->all(), ['json' => true]));
        }

        if ($request->boolean('download')) {
            return $pdf->download($filename);
        }

        if ($request->wantsJson()) {
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf');
        }

        return Inertia::render('Reports/PDFViewer', [
            'title' => $title,
            'pdfUrl' => $pdfUrl
        ]);
    }
}
