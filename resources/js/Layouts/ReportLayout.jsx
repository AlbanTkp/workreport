import React from 'react';
import { Head } from '@inertiajs/react';

export default function ReportLayout({ children, title }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-white print:bg-white">
                {children}
            </div>
        </>
    );
}
