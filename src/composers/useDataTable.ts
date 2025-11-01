// Dependencies - Framework.
import type { ValuesType, VisualContentOptions } from '@/index';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(viewType: ValuesType, content: VisualContentOptions, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
