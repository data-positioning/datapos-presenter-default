// Dependencies - Framework
import PresentationItem from './PresentationItem';
import { identifyRenderToElement, parseMarkdownToHTML } from './uiFacilitators';
import type { IPresentation, IPresentationData, IPresentationItem, IPresentationItemConfig } from './moveToShareCore';

// Class - Presentation
export default class Presentation implements IPresentation {
    readonly items: IPresentationItem[] = [];
    readonly label: Record<string, string>;
    readonly prefix: Record<string, string>;
    readonly suffix: Record<string, string>;

    constructor(config: IPresentationItemConfig) {
        for (const itemConfig of config.items || []) this.items.push(new PresentationItem(itemConfig));
        this.label = config.label || { en: '' };
        this.prefix = config.prefix || { en: '' };
        this.suffix = config.suffix || { en: '' };
    }

    async renderItems(data: IPresentationData, renderTo: string | HTMLElement | null, localeId: string = 'en'): Promise<void> {
        const renderToElement = identifyRenderToElement(renderTo);
        if (!renderToElement) return;
        for (const item of this.items) {
            const itemElement = document.createElement('div');
            itemElement.style.height = 'calc(90svh - 57px)';
            renderToElement.appendChild(itemElement);
            await item.renderVisual(data, itemElement, localeId);
        }
    }

    renderPrefix(renderTo: string | HTMLElement | null, localeId: string = 'en'): void {
        const renderToElement = identifyRenderToElement(renderTo);
        const text = this.prefix[localeId] || '';
        if (renderToElement && text) parseMarkdownToHTML(renderToElement, text);
    }

    renderSuffix(renderTo: string | HTMLElement | null, localeId: string = 'en'): void {
        const renderToElement = identifyRenderToElement(renderTo);
        const text = this.suffix[localeId] || '';
        if (renderToElement && text) parseMarkdownToHTML(renderToElement, text);
    }

    renderTitle(renderTo: string | HTMLElement | null, localeId: string = 'en'): string {
        const renderToElement = identifyRenderToElement(renderTo);
        const title = this.label[localeId] || '';
        if (renderToElement && title) renderToElement.replaceChildren(document.createTextNode(title));
        return title;
    }
}
