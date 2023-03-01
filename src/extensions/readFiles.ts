import { readdir } from "fs/promises";
export async function readFiles(path: string, recursive = true) {
    let files: any[] = [];
    const items = await readdir(path, { withFileTypes: true});
    for (const item of items) {
        if (item.isDirectory()) {
            files = [ ...files, ...(await readFiles(`${path}/${item.name}`))]
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(`${path}/${item.name}`)
        }
    }

    return files
}