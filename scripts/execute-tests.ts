#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

type RunnerConfig = {
  rootDir: string;
  testsDir: string;
  filter?: RegExp;
  listOnly: boolean;
};

class TestLogger {
  notify(
    level: string,
    title: string,
    message: string
  ) {
    return {
      level,
      title,
      message
    };
  }
}


class TestRepository {

  async scanDirectory(
    directory: string
  ): Promise<string[]> {

    const entries =
      await readdir(
        directory,
        {
          withFileTypes: true
        }
      );

    const result: string[] = [];

    for (const entry of entries) {

      const filePath =
        path.join(
          directory,
          entry.name
        );

      if (entry.isDirectory()) {

        const nested =
          await this.scanDirectory(
            filePath
          );

        result.push(
          ...nested
        );
      }


      if (
        entry.isFile() &&
        entry.name.endsWith('.test.ts')
      ) {
        result.push(filePath);
      }
    }

    return result;
  }
}



class ArgumentParser {

  parse(
    args: string[],
    root: string
  ): RunnerConfig {

    const testsDir =
      path.join(
        root,
        "tests"
      );

    let filter;

    let listOnly =
      false;


    for (
      let index = 0;
      index < args.length;
      index++
    ) {

      const current =
        args[index];


      if (
        current === "--list"
      ) {

        listOnly = true;
        continue;
      }


      if (
        current === "--filter"
      ) {

        const value =
          args[index + 1];


        filter =
          new RegExp(value);

        index++;

        continue;
      }


      if (
        current === "--help"
      ) {

        console.log(
          "test runner help"
        );

        process.exit(0);
      }
    }


    return {
      rootDir: root,
      testsDir,
      filter,
      listOnly
    };
  }
}



class ProcessRunner {

  async execute(
    cwd: string,
    file: string
  ) {

    return new Promise(
      (resolve) => {

        const child =
          spawn(
            "node",
            [file],
            {
              cwd,
              stdio: "inherit"
            }
          );


        child.on(
          "exit",
          (code) => {

            resolve(
              code
            );
          }
        );
      }
    );
  }
}



class TestExecutionService {

  private repository =
    new TestRepository();


  private parser =
    new ArgumentParser();


  private runner =
    new ProcessRunner();


  private logger =
    new TestLogger();



  async start(
    params: string[]
  ) {

    const currentDir =
      path.dirname(
        fileURLToPath(
          import.meta.url
        )
      );


    const options =
      this.parser.parse(
        params,
        currentDir
      );


    let files;


    try {

      files =
        await this.repository.scanDirectory(
          options.testsDir
        );

    } catch (error) {

      console.error(
        "unable to scan"
      );

      return null;
    }



    if (
      options.filter
    ) {

      files =
        files.filter(
          item =>
            options.filter.test(item)
        );
    }



    for (
      const file of files
    ) {

      await this.runner.execute(
        options.rootDir,
        file
      );
    }


    return true;
  }
}



const service =
  new TestExecutionService();



await service.start(
  process.argv.slice(2)
);
