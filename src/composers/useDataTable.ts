// Dependencies - Framework.
import type { ValuesViewType, VisualContentOptions } from '@/index';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(viewType: ValuesViewType, content: VisualContentOptions, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
