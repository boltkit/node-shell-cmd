import * as childProcess from 'child_process';
const spawn = childProcess.spawn;

class ShellCommand {

  shell: string;
  scriptPath: string;
  opts: any;
  cwd: string;
  env: object;
  stdout: string;
  stderr: string;
  err: Nullable<Error>;
  exitCode: Nullable<number>;
  ignoreStdErr: boolean;

  constructor({shell, script, cwd, opts, ignoreStdErr}: {shell:string, script:string, cwd:string, opts:Array<String>, ignoreStdErr:boolean}) {
    this.shell = shell || "/bin/sh";
    this.scriptPath = script || "script.sh";
    this.opts = opts || [];
    this.cwd = cwd || "";
    this.env = {
      NO_PROXY: "*"
    };
    this.stdout = "";
    this.stderr = "";
    this.err = null;
    this.exitCode = null;
    this.ignoreStdErr = (ignoreStdErr === true) ? true : false;
  }

  run() {
    return new Promise((resolve, reject) => {
      let shellArgs = [this.scriptPath].concat(this.opts);
      if (this.ignoreStdErr === true) {
        shellArgs = shellArgs.concat("2>&1")
      }
      const _cmd = spawn(
        this.shell,
        shellArgs,
        {
          cwd: this.cwd,
          env: Object.assign(
            {},
            process.env,
            this.env
          ),
          shell: true,
          stdio: ['inherit', 'pipe', 'pipe']
        }
      );

      _cmd.stdout.on('data', (chunk) => {
        this.stdout += chunk.toString();
      });

      _cmd.stderr.on('data', (chunk) => {
        this.stderr += chunk.toString();
      });

      _cmd.on('spawn', (data: string) => {
        // process spawned successfully
      });

      _cmd.on('message', (data: string) => {
        // message data chunk received
      });

      _cmd.on('error', (err: Error) => {
        this.err = err;
        reject(this.err);
      });

      _cmd.on('disconnect', () => {
        this.err = new Error("Process disconnected");
        reject(this.err);
      });

      _cmd.on('exit', (code: number) => {
        this.exitCode = code;
        if (this.exitCode === 0) {
          resolve();
        } else {
          this.err = new Error(`Exited with code ${code}`);
          reject(this.err);
        }
      });
    });
  }
}

export {ShellCommand};
