import { Command, flags } from "@oclif/command";

import chalk from "chalk";
import * as shelljs from "shelljs";
import { testTargetDirectory, displayCommandHeader } from "../actions";
import * as inquirer from "inquirer";

export default class Down extends Command {
  static description = "Stops a running Laravel Up project";

  static flags = {
    verbose: flags.boolean({
      char: "v",
      default: false,
      description: "To have descriptive log process"
    }),
    destroy: flags.boolean({
      char: "d",
      default: false,
      description: "To destroy Laravel up dev environment docker volumes"
    })
  };

  static args = [
    {
      name: "directory",
      description: "Running Laravel Up directory you would like to stop"
    }
  ];

  async run() {
    const { args, flags } = this.parse(Down);

    displayCommandHeader("Shutting down your Laravel up dev environment...");

    const directory = args.directory
      ? args.directory
      : shelljs.pwd().toString();

    if (!testTargetDirectory(directory)) {
      return false;
    }

    if (flags.destroy) {
      const assuredDestroy = (await inquirer.prompt([
        {
          message: chalk.yellow(
            "Are you sure you would like remove dev environment volumes?"
          ),
          name: "confirm",
          type: "confirm"
        }
      ])).confirm;

      if (!assuredDestroy) {
        return;
      }
    }

    shelljs.cd(directory);
    shelljs.exec(
      ["docker-compose", "down", flags.destroy ? "-v" : ""].join(" "),
      { silent: !flags.verbose }
    );

    const extendedMessage = ` & ${chalk.bgRedBright(
      chalk.black(" ✘ removed ")
    )} dev environment volumes`;

    console.log(
      chalk.green(
        `\nYour dev environment is stopped${
          flags.destroy ? extendedMessage : ""
        }.`
      )
    );
  }
}
