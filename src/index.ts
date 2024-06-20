// Dependencies - Vendor

// Dependencies - Framework
import type { PresentationItemConfig, PresentationSet, PresentationSetConfig } from '@datapos/datapos-share-core';

// Dependencies - Data
import index from './index.json';

// Classes - Default Presentation Set
export default class DefaultPresentor implements Presentor {
    readonly config: PresentorConfig;
    private index: PresentationSetConfig;

    constructor(presentationSetConfig: PresentationSetConfig) {
        this.config = presentationSetConfig;
        this.index = index as PresentationSetConfig;
    }

    getIndex(): PresentationItemConfig[] {
        return [];
    }

    list(path: string = ''): PresentationItemConfig[] {
        const pathSegments = path.split('/');
        let items = this.index.items;
        for (let segmentIndex = 1; segmentIndex < pathSegments.length; segmentIndex++) {
            const childItem = items.find((item) => item.id === pathSegments[segmentIndex]);
            if (childItem && childItem.typeId === 'folder') {
                items = childItem.items || [];
            } else {
                return []; // Path is invalid.
            }
        }
        return items;
    }

    async render(id: string, renderTo: string | HTMLElement): Promise<void> {
        console.log('render', id, renderTo);
    }
}
