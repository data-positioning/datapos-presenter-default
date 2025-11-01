// Composables - Use data table.
export function useDataTable() {
    // Operations - Render.
    function render(element: HTMLElement) {
        element.textContent = 'values table goes here...';
    }

    // Exposures
    return { render };
}
