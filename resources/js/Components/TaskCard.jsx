import React from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onEdit }) {
    const statusColors = {
        not_started: 'bg-red-100 text-red-800 border-red-200',
        in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        completed: 'bg-green-100 text-green-800 border-green-200'
    };

    const priorityColors = {
        low: 'bg-blue-100 text-blue-800 border-blue-200',
        medium: 'bg-purple-100 text-purple-800 border-purple-200',
        high: 'bg-pink-100 text-pink-800 border-pink-200'
    };

    const handleProgressUpdate = (newProgress) => {
        router.put(route('tasks.update', task.id), {
            progress_percentage: newProgress,
            status: newProgress === 100 ? 'completed' : task.status
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                            {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                {task.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                {task.priority.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onEdit}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>

                {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {task.description}
                    </p>
                )}

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{task.progress_percentage}%</span>
                    </div>
                    <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${task.progress_percentage}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-2 rounded-full ${
                                    task.progress_percentage === 100 ? 'bg-green-500' :
                                    task.progress_percentage > 50 ? 'bg-blue-500' :
                                    'bg-yellow-500'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Subtasks ({task.subtasks.length})
                        </h4>
                        <div className="space-y-2">
                            {task.subtasks.map(subtask => (
                                <motion.div
                                    key={subtask.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            subtask.status === 'completed' ? 'bg-green-500' :
                                            subtask.status === 'in_progress' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                            {subtask.title}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {subtask.progress_percentage}%
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(task.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleProgressUpdate(Math.min(100, task.progress_percentage + 25))}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>25%</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleProgressUpdate(Math.max(0, task.progress_percentage - 25))}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                            <span>25%</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
