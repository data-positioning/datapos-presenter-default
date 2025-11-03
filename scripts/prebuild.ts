// Dependencies - Vendor.
import { promises as fs } from 'fs';
import frontMatter from 'front-matter';
import path from 'path';

// Dependencies - Framework.
import type { ComponentRef, PresentationConfig } from '@datapos/datapos-shared';

// Types
type FrontMatter = { label: Record<string, string>; description: Record<string, string>; order: number };
type PresentationItem = PresentationFolderItem | PresentationFileItem;
type PresentationFolderItem = { id: string; typeId: 'folder'; children: PresentationItem[] };
type PresentationFileItem = { id: string; typeId: 'file' };

// Operations - Construct presentation configurations.
async function constructPresentationConfigs() {
    const topPath = 'src/presentations';
    const presentationMap: Record<string, PresentationConfig> = {};
    await constructPresentationConfigsForPath(topPath, presentationMap);

    await fs.writeFile('./configPresentations.json', JSON.stringify(presentationMap));

    const config = await JSON.parse(await fs.readFile('config.json', 'utf8'));
    config.presentations = Object.entries(presentationMap).map(
        (item): ComponentRef => ({ id: item[1].id, label: item[1].label, description: item[1].description, order: item[1].order, path: item[0] })
    );
    await fs.writeFile('config.json', JSON.stringify(config, undefined, 4));

    // Utilities - Compress JSON code blocks
    function compressJSONBlocks(markdown: string): string {
        // Capture optional info string after `json` in group 1, and code in group 2.
        const re = /```json([^\n`]*)\n([\s\S]*?)\n```/g;

        return markdown.replace(re, (match, infoRaw, code) => {
            const info = (infoRaw || '').trim(); // e.g. 'datapos-visual'.
            // Trim only surrounding blank lines — keeping internal indentation is okay for JSON.parse
            const trimmedCode = code.replace(/^\s+|\s+$/g, '');
            try {
                const parsed = JSON.parse(trimmedCode);
                const minified = JSON.stringify(parsed);
                // Rebuild fence, preserving info token if present
                return `\`\`\`json${info ? ' ' + info : ''}\n${minified}\n\`\`\``;
            } catch (err) {
                // If invalid JSON, leave original block untouched
                return match;
            }
        });
    }

    // Utilities - Construct presentation configurations.
    async function constructPresentationConfigsForPath(currentPath: string, presentationMap: Record<string, PresentationConfig>) {
        const dirItems = await fs.readdir(currentPath);
        for (const itemName of dirItems) {
            const itemPath = `${currentPath}/${itemName}`;
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                await constructPresentationConfigsForPath(itemPath, presentationMap);
            } else {
                if (path.extname(itemPath) !== '.md') continue;
                const itemContent = await fs.readFile(itemPath, 'utf8');
                if (!itemContent) continue;
                const content = frontMatter<FrontMatter>(itemContent);
                const contentBody = compressJSONBlocks(content.body);
                const id = `${currentPath.substring(topPath.length + 1)}/${path.basename(itemPath, '.md')}`;
                presentationMap[id] = {
                    id: id.replace(/\/(.)/g, (_, c) => c.toUpperCase()),
                    label: content.attributes.label,
                    description: content.attributes.description,
                    order: content.attributes.order,
                    statusId: 'alpha',
                    typeId: 'presenterPresentation',
                    content: contentBody // TODO: Can we remove all padding such as "\n  "? Maybe 'dedent' on frontmatter? Parse and stringify on JSON?
                };
            }
        }
    }
}

// Pre-build Processing
constructPresentationConfigs();
