import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

const PDFViewer = ({ pdfUrl, title }) => {
    return (
        <>
            <Head title={title} />
            
            <div className="p-0 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                {/* <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
                    <a
                        href={`${pdfUrl}?download=true`}
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase bg-blue-600 rounded-md border border-transparent transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Download PDF
                    </a>
                </div> */}
                
                <div className="w-full h-[800px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title={title}
                    />
                </div>
            </div>
        </>
    );
};

PDFViewer.layout = page => <AppLayout children={page} />;

export default PDFViewer;
