// Dependencies
import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';

// Declarations
type PresentationItem = PresentationFolderItem | PresentationFileItem;
type PresentationFolderItem = { id: string; typeId: 'folder'; children: PresentationItem[] };
type PresentationFileItem = { id: string; typeId: 'file' };

type PresentationThing = { label: Record<string, string>; description: Record<string, string>; order: number; content: string };

// Operations - Construct presentation configuration.
async function constructPresentationConfig() {
    const topPath = 'src/presentations';
    const topPresentationItem: PresentationItem = { id: 'top', typeId: 'folder', children: [] };
    const presentationMap = {};
    await constructPresentationItems(topPath, topPresentationItem, presentationMap);
    await fs.writeFile('./configPresentations.json', JSON.stringify(presentationMap));

    // Utilities - Construct presentation item.
    async function constructPresentationItems(dirPath: string, presentationItem: PresentationFolderItem, presentationMap: Record<string, PresentationThing>) {
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
                const { data: frontmatter, content: markdown } = matter(itemContent);
                presentationMap[`${things.join('/')}/${path.basename(itemPath, '.md')}`] = {
                    label: frontmatter.label,
                    description: frontmatter.description,
                    order: frontmatter.order,
                    content: itemContent // TODO: Can we remove all padding such as "\n  "?
                };
                const childItem: PresentationFileItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
            }
        }
    }
}

// Pre-build Processing
constructPresentationConfig();
