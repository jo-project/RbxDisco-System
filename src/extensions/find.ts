import { globalFilePath } from "../types/path.type.js"
import { resolve } from "path"
export async function find(path: any) {
    const command = await import(globalFilePath(resolve(path))).then(x => x.default).catch(() => {})
    return command
}