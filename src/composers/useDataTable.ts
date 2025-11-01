// Dependencies - Framework.
import type { ViewType, VisualContentOptions } from '@/index';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(viewType: ViewType, content: VisualContentOptions, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
