// Dependencies - Vendor
// import markdownIt from 'markdown-it'; // TODO: Move this to 'dev-dependencies'.

// Module Variables
// let markdown: markdownIt | undefined = undefined;

// Facilitators - Identify 'Render To' Element
export const identifyRenderToElement = (renderTo: string | HTMLElement | null): HTMLElement => {
    if (typeof renderTo === 'string') {
        const element = document.getElementById(renderTo);
        if (!element) throw new Error("Could not locate 'render to' element.");
        return element;
    } else if (renderTo instanceof HTMLElement) {
        return renderTo;
    } else {
        throw new Error("Could not establish 'render to' element.");
    }
};

// Facilitators - Parse Markdown to HTML
export const parseMarkdownToHTML = (renderToElement: HTMLElement, text: string) => {
    // if (!markdown) markdown = markdownIt();
    // const wrapperElement = document.createElement('div');
    // wrapperElement.innerHTML = markdown.render(text);
    // renderToElement.appendChild(wrapperElement);
};
