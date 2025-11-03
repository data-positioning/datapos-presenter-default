// Dependencies - Framework.
import type { PresentationVisualContentConfig, PresentationVisualValuesViewType } from '@datapos/datapos-shared';

// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(viewType: PresentationVisualValuesViewType, contentConfig: PresentationVisualContentConfig, element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
