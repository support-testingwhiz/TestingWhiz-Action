import { writeFile, mkdir, readdir, copyFile } from 'fs/promises'
import * as path from 'path'
import { PathLike, existsSync } from 'fs'

export class FileManager {
  /**
   * Checks if a file or directory exists.
   * @param path Path to check
   * @returns true if path exists, false otherwise
   */
  public pathExists = (path: string): boolean => {
    return existsSync(path)
  }

  /**
   * Writes JSON data as a JavaScript variable assignment to a specified file.
   * @param filePath Absolute or relative path to the output file.
   * @param variableName Name of the variable to assign the JSON data to.
   * @param data The data to stringify and write.
   */
  public writeVariableToFile = async (
    filePath: PathLike,
    variableName: string,
    data: string
  ): Promise<void> => {
    const content = `var ${variableName} = ${data};`
    await writeFile(filePath, content, 'utf8')
  }

  public copyFolderRecursive = async (src: string, dest: string) => {
    await mkdir(dest, { recursive: true })
    const entries = await readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name)
      const destPath = path.join(dest, entry.name)

      if (entry.isDirectory()) {
        await this.copyFolderRecursive(srcPath, destPath)
      } else {
        await copyFile(srcPath, destPath)
      }
    }
  }
}
