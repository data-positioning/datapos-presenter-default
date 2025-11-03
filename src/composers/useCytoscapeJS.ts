// Dependencies - Vendor.

// Dependencies - Framework.
import type { PresentationView } from '@datapos/datapos-shared';
import type { VisualContentConfig } from '@/index';

// Interfaces/Types - Cytoscape.js view.
export interface CytoscapeJSView extends PresentationView {
    diagram: unknown;
}

// Composables - Use Cytoscape.js.
export function useCytoscapeJS() {
    // Operations - Render.
    function render(viewType: unknown, content: VisualContentConfig, element: HTMLElement) {
        element.textContent = 'Cytoscape.js diagram goes here...';
    }

    // Exposures
    return { render };
}
