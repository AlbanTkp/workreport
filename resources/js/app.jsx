import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import AppLayout from './Layouts/AppLayout';

Chart.register(CategoryScale);

const appName = import.meta.env.VITE_APP_NAME || 'Work Report Manager';

// Check system dark mode preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        );
        
        // Set default layout if not specified
        if (page.default.layout === undefined && !name.includes('Auth/')) {
            page.default.layout = page => <AppLayout>{page}</AppLayout>;
        }
        
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
