// Dependencies
import { promises as fs } from 'fs';

// Declarations
type PresentationItem = FolderItem | FileItem;
type FolderItem = { id: string; typeId: 'folder'; children: PresentationItem[] };
type FileItem = { id: string; typeId: 'file' };

//
async function constructPresentationConfig() {
    async function constructPresentationItems(dirPath: string, presentationItem: FolderItem) {
        const dirItems = await fs.readdir(dirPath);
        for (const itemName of dirItems) {
            const itemPath = `${dirPath}/${itemName}`;
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                const childItem: FolderItem = { id: itemName, typeId: 'folder', children: [] };
                presentationItem.children.push(childItem);
                await constructPresentationItems(itemPath, childItem);
            } else {
                const childItem: FileItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
            }
        }
    }

    const topPresentationItem: PresentationItem = { id: 'top', typeId: 'folder', children: [] };
    await constructPresentationItems('src/presentations', topPresentationItem);

    console.log(JSON.stringify(topPresentationItem, undefined, 4));
}

constructPresentationConfig();
