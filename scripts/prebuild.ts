// Dependencies - Vendor.
import { promises as fs } from 'fs';
import frontMatter from 'front-matter';
import path from 'path';

import type { ComponentRef, PresentationConfig } from '@datapos/datapos-shared';

// Declarations
type PresentationItem = PresentationFolderItem | PresentationFileItem;
type PresentationFolderItem = { id: string; typeId: 'folder'; children: PresentationItem[] };
type PresentationFileItem = { id: string; typeId: 'file' };

// Operations - Construct presentation configuration.
async function constructPresentationConfig() {
    const topPath = 'src/presentations';
    const topPresentationItem: PresentationFolderItem = { id: 'top', typeId: 'folder', children: [] };
    const presentationMap: Record<string, PresentationConfig> = {};
    await constructPresentationItems(topPath, topPresentationItem, presentationMap);

    await fs.writeFile('./configPresentations.json', JSON.stringify(presentationMap));

    const config = await JSON.parse(await fs.readFile('config.json', 'utf8'));
    config.presentations = Object.entries(presentationMap).map(
        (item): ComponentRef => ({
            id: item[1].id,
            label: item[1].label,
            description: item[1].description,
            order: item[1].order,
            path: item[0]
        })
    );
    await fs.writeFile('config.json', JSON.stringify(config, undefined, 4));

    // Utilities - Construct presentation item.
    async function constructPresentationItems(dirPath: string, presentationItem: PresentationFolderItem, presentationMap: Record<string, PresentationConfig>) {
        const dirItems = await fs.readdir(dirPath);
        for (const itemName of dirItems) {
            const itemPath = `${dirPath}/${itemName}`;
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                const childItem: PresentationFolderItem = { id: itemName, typeId: 'folder', children: [] };
                presentationItem.children.push(childItem);
                await constructPresentationItems(itemPath, childItem, presentationMap);
            } else {
                if (path.extname(itemPath) !== '.md') continue;
                const itemContent = await fs.readFile(itemPath, 'utf8');
                if (!itemContent) continue;
                const things = dirPath.substring(topPath.length + 1).split('/');
                var content = frontMatter<{ label: Record<string, string>; description: Record<string, string>; order: number }>(itemContent);
                const id = `${things.join('/')}/${path.basename(itemPath, '.md')}`;
                presentationMap[id] = {
                    id: id.replace(/\/(.)/g, (_, c) => c.toUpperCase()),
                    label: content.attributes.label,
                    description: content.attributes.description,
                    order: content.attributes.order,
                    statusId: 'alpha',
                    typeId: 'presenterPresentation',
                    content: content.body // TODO: Can we remove all padding such as "\n  "? Maybe 'dedent' on frontmatter? Parse and stringify on JSON?
                };
                const childItem: PresentationFileItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
            }
        }
    }
}

// Pre-build Processing
constructPresentationConfig();
