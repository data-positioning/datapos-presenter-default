// Dependencies
import { promises as fs } from 'fs';
//
async function constructPresentationConfig() {
    async function constructPresentationItems(dirPath, presentationItem) {
        const dirItems = await fs.readdir(dirPath);
        for (const itemName of dirItems) {
            const itemPath = `${dirPath}/${itemName}`;
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                console.log(itemPath, 'Directory');
                const childItem = { id: itemName, typeId: 'folder', children: [] };
                presentationItem.children.push(childItem);
                await constructPresentationItems(itemPath, childItem);
            }
            else {
                const childItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
                console.log(itemPath, 'FILE');
            }
        }
    }
    const topPresentationItem = { id: 'top', typeId: 'folder', children: [] };
    await constructPresentationItems('src/presentations', topPresentationItem);
    console.log(JSON.stringify(topPresentationItem, undefined, 4));
}
constructPresentationConfig();
