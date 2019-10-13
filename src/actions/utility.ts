import { promisify } from "util";
import * as fs from "fs";
import * as shelljs from "shelljs";
import chalk from "chalk";

export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);

export const tryChangeDirectory = (candidateDir: string) => {
  if (
    !fs.existsSync(candidateDir) ||
    !fs.lstatSync(candidateDir).isDirectory()
  ) {
    console.log(
      chalk.red(`\n${candidateDir} is not a valid project directory`)
    );
    return false;
  }

  shelljs.cd(candidateDir);

  return true;
};

export const replaceFileContent = async (
  filePath: string,
  replaceArgs: string[]
) => {
  const fileContent = await readFileAsync(filePath);
  const newContent = fileContent
    .toString()
    .replace(replaceArgs[0], replaceArgs[1]);
  await writeFileAsync(filePath, newContent);
};
