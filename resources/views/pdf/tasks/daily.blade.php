<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Task Report</title>
    <style>
        @page {
            margin: 2.5cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .header h1 {
            color: #1a202c;
            font-size: 2.25rem;
            margin: 0 0 0.5rem 0;
            font-weight: 700;
        }
        .header p {
            color: #4a5568;
            font-size: 1.1rem;
            margin: 0;
        }
        .stats-grid {
            display: table;
            width: 100%;
            margin-bottom: 2.5rem;
            border-collapse: separate;
            border-spacing: 1rem;
        }
        .stat-box {
            display: table-cell;
            width: 25%;
            background: #f7fafc;
            padding: 1.25rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
            border: 1px solid #e2e8f0;
        }
        .stat-box h3 {
            color: #4a5568;
            font-size: 1rem;
            margin: 0 0 0.5rem 0;
            font-weight: 600;
        }
        .stat-box p {
            color: #2d3748;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
        }
        .tasks-section {
            margin-bottom: 2rem;
        }
        .section-title {
            color: #2d3748;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .task-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1.25rem;
            margin-bottom: 1rem;
            page-break-inside: avoid;
        }
        .task-header {
            display: table;
            width: 100%;
            margin-bottom: 0.75rem;
        }
        .task-title {
            display: table-cell;
            vertical-align: middle;
            color: #2d3748;
            font-size: 1.1rem;
            font-weight: 600;
        }
        .task-priority {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
        }
        .priority-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .priority-high {
            background-color: #fff5f5;
            color: #c53030;
            border: 1px solid #feb2b2;
        }
        .priority-medium {
            background-color: #fffaf0;
            color: #c05621;
            border: 1px solid #fbd38d;
        }
        .priority-low {
            background-color: #f0fff4;
            color: #2f855a;
            border: 1px solid #9ae6b4;
        }
        .task-description {
            color: #4a5568;
            font-size: 0.95rem;
            margin-bottom: 0.75rem;
        }
        .task-meta {
            color: #718096;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        .task-meta span {
            margin-right: 1rem;
        }
        .task-details {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e2e8f0;
            font-size: 0.9rem;
        }
        .task-details p {
            margin: 0.5rem 0;
            color: #4a5568;
        }
        .task-details strong {
            color: #2d3748;
            font-weight: 600;
        }
        .footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #718096;
            font-size: 0.875rem;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Daily Task Report</h1>
            <p>{{ $date }}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-box">
                <h3>Total Tasks</h3>
                <p>{{ count($tasks) }}</p>
            </div>
            <div class="stat-box">
                <h3>Completed</h3>
                <p>{{ $completed }}</p>
            </div>
            <div class="stat-box">
                <h3>In Progress</h3>
                <p>{{ $inProgress }}</p>
            </div>
            <div class="stat-box">
                <h3>Not Started</h3>
                <p>{{ $notStarted }}</p>
            </div>
        </div>

        @foreach(['completed' => 'Completed Tasks', 'in-progress' => 'In Progress Tasks', 'not-started' => 'Not Started Tasks'] as $status => $title)
            <div class="tasks-section">
                <h2 class="section-title">{{ $title }}</h2>
                @foreach($tasks->where('status', str_replace('-', '_', $status)) as $task)
                    <div class="task-card">
                        <div class="task-header">
                            <div class="task-title">{{ $task->title }}</div>
                            <div class="task-priority">
                                <span class="priority-badge priority-{{ $task->priority }}">
                                    {{ ucfirst($task->priority) }} Priority
                                </span>
                            </div>
                        </div>
                        <div class="task-description">{{ $task->description }}</div>
                        <div class="task-meta">
                            <span>Due: {{ $task->due_date->format('M d, Y') }}</span>
                            <span>Progress: {{ $task->progress_percentage }}%</span>
                        </div>
                        @if($task->difficulties || $task->solutions || $task->notes)
                            <div class="task-details">
                                @if($task->difficulties)
                                    <p><strong>Difficulties:</strong> {{ $task->difficulties }}</p>
                                @endif
                                @if($task->solutions)
                                    <p><strong>Solutions:</strong> {{ $task->solutions }}</p>
                                @endif
                                @if($task->notes)
                                    <p><strong>Notes:</strong> {{ $task->notes }}</p>
                                @endif
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
            @if(!$loop->last)
                <div class="page-break"></div>
            @endif
        @endforeach

        <div class="footer">
            <p>Generated on {{ now()->format('F d, Y \a\t h:i A') }}</p>
        </div>
    </div>
</body>
</html>
