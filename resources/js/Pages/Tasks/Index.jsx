import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/Components/TaskCard';
import TaskForm from '@/Components/TaskForm';
import { Line, Doughnut } from 'react-chartjs-2';
import AppLayout from '@/Layouts/AppLayout';

const Index = ({ tasks, filters, weeklyStats }) => {
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [dateRange, setDateRange] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || ''
    });
    const [viewMode, setViewMode] = useState('board');
    const [showStats, setShowStats] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter tasks based on search query and date range
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = !searchQuery || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDateRange = (!dateRange.start_date || task.due_date >= dateRange.start_date) &&
            (!dateRange.end_date || task.due_date <= dateRange.end_date);

        return matchesSearch && matchesDateRange;
    });

    // Group tasks by status for board view
    const statusColumns = {
        'not-started': filteredTasks.filter(task => task.status === 'not-started'),
        'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
        'completed': filteredTasks.filter(task => task.status === 'completed')
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDateRangeChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;
        const task = tasks.find(t => t.id === parseInt(taskId));

        if (task && task.status !== newStatus) {
            router.put(`/tasks/${taskId}`, {
                ...task,
                status: newStatus
            });
        }
    };

    const handlePrintReport = (type) => {
        const params = new URLSearchParams({
            type,
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            search: searchQuery
        });

        window.open(`/tasks/report?${params.toString()}`, '_blank');
    };

    const getChartData = () => ({
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [
                statusColumns.completed.length,
                statusColumns['in-progress'].length,
                statusColumns['not-started'].length
            ],
            backgroundColor: [
                'rgba(16, 185, 129, 0.2)',
                'rgba(245, 158, 11, 0.2)',
                'rgba(239, 68, 68, 0.2)'
            ],
            borderColor: [
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)'
            ],
            borderWidth: 1
        }]
    });

    const handleFilterChange = (field, value) => {
        router.get('/tasks', {
            params: {
                [field]: value
            }
        });
    };

    return (
        <>
            <Head title="Tasks" />
            
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Task Board</h1>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowNewTaskForm(true)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="mr-2 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Task
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="mr-2 -ml-1 w-5 h-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                    <select
                                        value={filters.priority || ''}
                                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                                        className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">All</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                {/* Date Range Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                    <input
                                        type="date"
                                        value={filters.start_date || ''}
                                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                        className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                    <input
                                        type="date"
                                        value={filters.end_date || ''}
                                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                        className="block py-2 pr-10 pl-3 mt-1 w-full text-base rounded-md border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Weekly Progress Chart */}
                    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Weekly Progress</h3>
                        <div className="h-64">
                            <Line
                                data={weeklyStats}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                            grid: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                        x: {
                                            ticks: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                            grid: {
                                                display: false,
                                            },
                                        },
                                    },
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Task Distribution Chart */}
                    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Task Distribution</h3>
                        <div className="h-64">
                            <Doughnut
                                data={{
                                    labels: ['Pending', 'In Progress', 'Completed'],
                                    datasets: [{
                                        data: [
                                            tasks.filter(task => task.status === 'pending').length,
                                            tasks.filter(task => task.status === 'in_progress').length,
                                            tasks.filter(task => task.status === 'completed').length,
                                        ],
                                        backgroundColor: ['#FCD34D', '#60A5FA', '#34D399'],
                                    }],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                color: 'rgba(0, 0, 0, 0.1)',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                {viewMode === 'board' ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {Object.entries(statusColumns).map(([status, columnTasks]) => (
                                <Droppable key={status} droppableId={status}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="p-4 bg-white rounded-xl shadow-sm dark:bg-gray-800"
                                        >
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900 capitalize dark:text-white">
                                                {status.replace('_', ' ')} ({columnTasks.length})
                                            </h3>
                                            <div className="space-y-4">
                                                {columnTasks.map((task, index) => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        index={index}
                                                        onClick={() => setSelectedTask(task)}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Task</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Priority</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Progress</th>
                                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {filteredTasks.map(task => (
                                        <tr key={task.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <div>
                                                        <p className="font-semibold">{task.title}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {task.description?.substring(0, 50)}
                                                            {task.description?.length > 50 ? '...' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${
                                                    task.status === 'completed'
                                                        ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                                                        : task.status === 'in-progress'
                                                        ? 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100'
                                                        : 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${
                                                    task.priority === 'high'
                                                        ? 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100'
                                                        : task.priority === 'medium'
                                                        ? 'text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100'
                                                        : 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div
                                                        className="h-2.5 bg-blue-600 rounded-full"
                                                        style={{ width: `${task.progress_percentage}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedTask(task)}
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {(showNewTaskForm || selectedTask) && (
                <TaskForm
                    task={selectedTask}
                    onClose={() => {
                        setShowNewTaskForm(false);
                        setSelectedTask(null);
                    }}
                />
            )}
        </>
    );
};

// Set layout at the component level
Index.layout = page => <AppLayout children={page} />;
export default Index;
