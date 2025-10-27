// Dependencies
import { promises as fs } from 'fs';

// Declarations
type PresentationItem = PresentationFolderItem | PresentationFileItem;
type PresentationFolderItem = { id: string; typeId: 'folder'; children: PresentationItem[] };
type PresentationFileItem = { id: string; typeId: 'file' };

// Operations - Construct presentation configuration.
async function constructPresentationConfig() {
    async function constructPresentationItems(dirPath: string, presentationItem: PresentationFolderItem) {
        const dirItems = await fs.readdir(dirPath);
        for (const itemName of dirItems) {
            const itemPath = `${dirPath}/${itemName}`;
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                const childItem: PresentationFolderItem = { id: itemName, typeId: 'folder', children: [] };
                presentationItem.children.push(childItem);
                await constructPresentationItems(itemPath, childItem);
            } else {
                const childItem: PresentationFileItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
            }
        }
    }

    const topPresentationItem: PresentationItem = { id: 'top', typeId: 'folder', children: [] };
    await constructPresentationItems('src/presentations', topPresentationItem);

    console.log(JSON.stringify(topPresentationItem, undefined, 4));
}

// Pre-build Processing
constructPresentationConfig();
