import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import moment from 'moment';
import ReportLayout from '@/Layouts/ReportLayout';

const Daily = ({ tasks, date }) => {
    useEffect(() => {
        window.print();
    }, []);

    const completedTasks = tasks.filter(task => task.status === 'completed');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const notStartedTasks = tasks.filter(task => task.status === 'not_started');

    return (
        <ReportLayout title="Daily Report">
            <div className="p-8">
                {/* Header Section */}
                <div className="mb-8 text-center border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Task Report</h1>
                    <p className="text-lg text-gray-600">{moment(date).format('MMMM D, YYYY')}</p>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
                        <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-green-700 mb-2">Completed</h3>
                        <p className="text-2xl font-bold text-green-900">{completedTasks.length}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-yellow-700 mb-2">In Progress</h3>
                        <p className="text-2xl font-bold text-yellow-900">{inProgressTasks.length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Not Started</h3>
                        <p className="text-2xl font-bold text-red-900">{notStartedTasks.length}</p>
                    </div>
                </div>

                {/* Task Lists by Status */}
                <div className="space-y-8">
                    {/* Completed Tasks */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-green-700 mb-4 border-b pb-2">
                            Completed Tasks ({completedTasks.length})
                        </h2>
                        <div className="space-y-4">
                            {completedTasks.map(task => (
                                <div key={task.id} className="p-4 bg-green-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span className="mr-4">Priority: {task.priority}</span>
                                        <span>Due: {moment(task.due_date).format('MMM D, YYYY')}</span>
                                    </div>
                                    {(task.difficulties || task.solutions || task.notes) && (
                                        <div className="mt-3 space-y-2 border-t pt-2">
                                            {task.difficulties && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Difficulties:</h4>
                                                    <p className="text-sm text-gray-600">{task.difficulties}</p>
                                                </div>
                                            )}
                                            {task.solutions && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Solutions:</h4>
                                                    <p className="text-sm text-gray-600">{task.solutions}</p>
                                                </div>
                                            )}
                                            {task.notes && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                                                    <p className="text-sm text-gray-600">{task.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In Progress Tasks */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-yellow-700 mb-4 border-b pb-2">
                            In Progress Tasks ({inProgressTasks.length})
                        </h2>
                        <div className="space-y-4">
                            {inProgressTasks.map(task => (
                                <div key={task.id} className="p-4 bg-yellow-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span className="mr-4">Priority: {task.priority}</span>
                                        <span>Due: {moment(task.due_date).format('MMM D, YYYY')}</span>
                                    </div>
                                    {(task.difficulties || task.solutions || task.notes) && (
                                        <div className="mt-3 space-y-2 border-t pt-2">
                                            {task.difficulties && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Difficulties:</h4>
                                                    <p className="text-sm text-gray-600">{task.difficulties}</p>
                                                </div>
                                            )}
                                            {task.solutions && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Solutions:</h4>
                                                    <p className="text-sm text-gray-600">{task.solutions}</p>
                                                </div>
                                            )}
                                            {task.notes && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                                                    <p className="text-sm text-gray-600">{task.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Not Started Tasks */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-red-700 mb-4 border-b pb-2">
                            Not Started Tasks ({notStartedTasks.length})
                        </h2>
                        <div className="space-y-4">
                            {notStartedTasks.map(task => (
                                <div key={task.id} className="p-4 bg-red-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span className="mr-4">Priority: {task.priority}</span>
                                        <span>Due: {moment(task.due_date).format('MMM D, YYYY')}</span>
                                    </div>
                                    {(task.difficulties || task.solutions || task.notes) && (
                                        <div className="mt-3 space-y-2 border-t pt-2">
                                            {task.difficulties && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Difficulties:</h4>
                                                    <p className="text-sm text-gray-600">{task.difficulties}</p>
                                                </div>
                                            )}
                                            {task.solutions && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Solutions:</h4>
                                                    <p className="text-sm text-gray-600">{task.solutions}</p>
                                                </div>
                                            )}
                                            {task.notes && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                                                    <p className="text-sm text-gray-600">{task.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm border-t pt-4">
                    <p>Generated on {moment().format('MMMM D, YYYY [at] h:mm A')}</p>
                </div>
            </div>
        </ReportLayout>
    );
};

export default Daily;
