import { tryChangeDirectory, readFileAsync } from "./utility";
import * as shelljs from "shelljs";
import * as path from "path";
import * as fs from "fs";
import * as jsyaml from "js-yaml";
import { UpEnvironmentConfig } from "../types";

export type FailedLaravelProjectResult = "invalid" | "missing" | "vanilla";

export type LaravelProjectResult =
  | UpEnvironmentConfig
  | FailedLaravelProjectResult;

export const isLaravelUpProject = (
  input: LaravelProjectResult
): input is LaravelProjectResult => {
  return typeof input !== "string";
};

const verifyLaravelProject = async (
  directory: string
): Promise<LaravelProjectResult> => {
  const result = tryChangeDirectory(directory);
  if (!result) {
    return "invalid";
  }

  const pwd = shelljs.pwd().toString();

  const lvlUpConfigPath = path.join(pwd, "laravel-up.yml");

  if (!fs.existsSync(lvlUpConfigPath)) {
    return fs.existsSync(path.join(pwd, "composer.json"))
      ? "vanilla"
      : "missing";
  }

  const contents = await readFileAsync(lvlUpConfigPath);

  const config = jsyaml.load(contents.toString()) as UpEnvironmentConfig;
  return config;
};

export default verifyLaravelProject;
