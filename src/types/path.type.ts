
import { pathToFileURL } from "url"
/**
 * 
 * @param {string} path 
 * @returns {string}
 */
export const globalFilePath = (path: string) => pathToFileURL(path)?.href || path