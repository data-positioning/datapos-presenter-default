// Dependencies - Vendor

// Dependencies - Framework
import type { PresentationItemConfig, PresentationSet, PresentationSetConfig } from '@datapos/datapos-share-core';

// Classes - Default Presentation Set
export default class DefaultPresentationSet implements PresentationSet {
    readonly config: PresentationSetConfig;

    constructor(presentationSetConfig: PresentationSetConfig) {
        this.config = presentationSetConfig;
    }

    getIndex(): PresentationItemConfig[] {
        return [];
    }

    async render(id: string, renderTo: string | HTMLElement): Promise<void> {
        console.log('render', id, renderTo);
    }
}
