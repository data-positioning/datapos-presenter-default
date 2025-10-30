// Dependencies
import { promises as fs } from 'fs';
import frontMatter from 'front-matter';
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
    const presentationMap: Record<string, PresentationThing> = {};
    await constructPresentationItems(topPath, topPresentationItem, presentationMap);

    await fs.writeFile('./configPresentations.json', JSON.stringify(presentationMap));

    const config = await JSON.parse(await fs.readFile('config.json', 'utf8'));
    config.presentations = Object.entries(presentationMap).map((item) => ({ path: item[0], label: item[1].label, description: item[1].description, order: item[1].order }));
    await fs.writeFile('config.json', JSON.stringify(config, undefined, 4));

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
                var content = frontMatter<{ label: Record<string, string>; description: Record<string, string>; order: number }>(itemContent);
                console.log(content);
                presentationMap[`${things.join('/')}/${path.basename(itemPath, '.md')}`] = {
                    label: content.attributes.label,
                    description: content.attributes.description,
                    order: content.attributes.order,
                    content: itemContent // TODO: Can we remove all padding such as "\n  "? Maybe 'dedent' on frontmatter? Parse and stringify on JSON?
                };
                const childItem: PresentationFileItem = { id: itemName, typeId: 'file' };
                presentationItem.children?.push(childItem);
            }
        }
    }
}

// Pre-build Processing
constructPresentationConfig();
