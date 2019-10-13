import { flags } from "@oclif/command";
import execa from "execa";
import BaseCommand from "./command-base";
import verifyLaravelProject from "../actions/verify-laravel-project-directory";
import chalk from "chalk";
import * as shelljs from "shelljs";

export default class Artisan extends BaseCommand {
  static description = "Runs an artisan command in the current directory";

  static strict = false;

  static flags = {
    ["command-help"]: flags.boolean({
      char: "h",
      description: "Passes --help to the underlying artisan command"
    })
  };

  static args = [
    {
      name: "command",
      description:
        "The command to pass to artisan. Omit this to see available commands",
      required: false
    }
  ];

  async run() {
    const { argv, flags } = this.parse(Artisan);

    await verifyLaravelProject("~/code/laravel-up-testx");
    // verifyLaravelProject(this.currentDirectory);

    try {
      console.log();

      // This relies on the app service actually existing
      const result = shelljs.exec("docker-compose exec -T app php artisan", {
        silent: true
      });

      if (result.stderr) {
        console.log(
          chalk.red(
            "Can't communicate with the PHP App container. Ensure your project is running using lvl up"
          )
        );
        return;
      }

      const artisanArgs = ["app", "php", "artisan", ...argv];
      if (flags["command-help"]) {
        artisanArgs.push("--help");
      }
      await execa("docker-compose exec", artisanArgs, {
        shell: true,
        stdio: "inherit"
      });
    } catch (e) {
      console.log(chalk.red("An unexpected error occurred"));
      return;
    }
  }
}
