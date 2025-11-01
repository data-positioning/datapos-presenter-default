// Dependencies - Framework.
import { VisualContentOptions } from '..';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(content: VisualContentOptions, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
