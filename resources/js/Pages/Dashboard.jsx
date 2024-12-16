import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = ({ tasks, weeklyStats }) => {
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const notStartedTasks = tasks.filter(task => task.status === 'not_started').length;

    // Chart data for task distribution
    const doughnutData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                data: [completedTasks, inProgressTasks, notStartedTasks],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',  // Green
                    'rgba(245, 158, 11, 0.8)',  // Yellow
                    'rgba(239, 68, 68, 0.8)',   // Red
                ],
                borderColor: [
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart data for weekly progress
    const lineData = {
        labels: weeklyStats.labels,
        datasets: weeklyStats.datasets,
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                {/* Total Tasks Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <div className="flex items-center">
                        <div className="p-3 mr-4 bg-blue-500 rounded-full">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{totalTasks}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Completed Tasks Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <div className="flex items-center">
                        <div className="p-3 mr-4 bg-green-500 rounded-full">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{completedTasks}</p>
                        </div>
                    </div>
                </motion.div>

                {/* In Progress Tasks Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <div className="flex items-center">
                        <div className="p-3 mr-4 bg-yellow-500 rounded-full">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{inProgressTasks}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Not Started Tasks Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <div className="flex items-center">
                        <div className="p-3 mr-4 bg-red-500 rounded-full">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Not Started</p>
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{notStartedTasks}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
                {/* Weekly Progress Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Weekly Progress</h2>
                    <Line data={lineData} options={chartOptions} />
                </motion.div>

                {/* Task Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
                >
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Task Distribution</h2>
                    <Doughnut data={doughnutData} options={chartOptions} />
                </motion.div>
            </div>

            {/* Recent Tasks Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800"
            >
                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Tasks</h2>
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Progress</th>
                                <th className="px-4 py-3">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {tasks.slice(0, 5).map((task) => (
                                <tr key={task.id} className="text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-sm">
                                            <div>
                                                <p className="font-semibold">{task.title}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                                            task.status === 'completed' ? 'text-green-700 bg-green-100' :
                                            task.status === 'in_progress' ? 'text-yellow-700 bg-yellow-100' :
                                            'text-red-700 bg-red-100'
                                        }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-2 bg-blue-500 rounded-full"
                                                style={{ width: `${task.progress}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(task.due_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}

Dashboard.layout = page => <AppLayout children={page} />;
export default Dashboard;
