import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import moment from 'moment';
import ReportLayout from '@/Layouts/ReportLayout';

const Weekly = ({ tasks, startDate, endDate }) => {
    useEffect(() => {
        window.print();
    }, []);

    // Group tasks by date
    const tasksByDate = {};
    const dates = [];
    let currentDate = moment(startDate);
    
    while (currentDate.isSameOrBefore(endDate)) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        dates.push(dateStr);
        tasksByDate[dateStr] = tasks.filter(task => 
            moment(task.due_date).format('YYYY-MM-DD') === dateStr
        );
        currentDate.add(1, 'days');
    }

    // Calculate weekly statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const notStartedTasks = tasks.filter(task => task.status === 'not_started');
    
    const priorityStats = {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length
    };

    return (
        <ReportLayout title="Weekly Report">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8 text-center border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Task Report</h1>
                    <p className="text-lg text-gray-600">
                        {moment(startDate).format('MMMM D')} - {moment(endDate).format('MMMM D, YYYY')}
                    </p>
                </div>

                {/* Weekly Overview */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
                            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-green-700">Completed</h3>
                            <p className="text-2xl font-bold text-green-900">{completedTasks.length}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-yellow-700">In Progress</h3>
                            <p className="text-2xl font-bold text-yellow-900">{inProgressTasks.length}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-red-700">Not Started</h3>
                            <p className="text-2xl font-bold text-red-900">{notStartedTasks.length}</p>
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Priority Distribution</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-red-700">High Priority</h3>
                            <p className="text-2xl font-bold text-red-900">{priorityStats.high}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-yellow-700">Medium Priority</h3>
                            <p className="text-2xl font-bold text-yellow-900">{priorityStats.medium}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-green-700">Low Priority</h3>
                            <p className="text-2xl font-bold text-green-900">{priorityStats.low}</p>
                        </div>
                    </div>
                </div>

                {/* Daily Breakdown */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Breakdown</h2>
                    {dates.map(date => {
                        const dayTasks = tasksByDate[date];
                        if (dayTasks.length === 0) return null;

                        return (
                            <div key={date} className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                    {moment(date).format('dddd, MMMM D')}
                                </h3>
                                <div className="space-y-4">
                                    {dayTasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            className={`p-4 rounded-lg ${
                                                task.status === 'completed' ? 'bg-green-50' :
                                                task.status === 'in_progress' ? 'bg-yellow-50' :
                                                'bg-red-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{task.title}</h4>
                                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <span className="mr-4">Status: {task.status}</span>
                                                <span>Progress: {task.progress_percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm border-t pt-4">
                    <p>Generated on {moment().format('MMMM D, YYYY [at] h:mm A')}</p>
                </div>
            </div>
        </ReportLayout>
    );
};

export default Weekly;
