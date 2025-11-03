// Dependencies - Framework.
import type { ValuesViewType, VisualContentConfig } from '@/index';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(viewType: ValuesViewType, content: VisualContentConfig, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
