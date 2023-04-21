

Simple utility implemented on top of `child_process` to run shell commands with many configurable runtime options


# All options

- `shell` is the shell binary you want ot use
- `script` is the script path you want to run
- `cwd` is the directory from which you want to run the script
- `opts` is an array of arguments you want to pass
- `redirectStdErr` let you rediect all stderr to stdout (off by default)


```
const cmd = new ShellCommand({
	shell: "/bin/sh",
	script: "test_scripts/trigger_error.sh",
	cwd: "",
	opts: ["abc"],
	redirectStdErr: false
});

try {
	await cmd.run();
	console.log(cmd.stdout);	
} catch (err) {
	console.log(err.message);
	console.log(cmd.stderr);
}
```


# Redirect stderr example

```
const cmd = new ShellCommand({
	script: "test_scripts/trigger_error.sh",
	redirectStdErr: true
});

try {
	await cmd.run();
	console.log(cmd.stdout);	
} catch (err) {
	console.log(err.message);
	console.log(cmd.stderr);
}
```

*stderr* will not contain the script error output, but *stdout* will

```
Exited with code 2

```



# Do not Redirect stderr example

```
const cmd = new ShellCommand({
	script: "test_scripts/trigger_error.sh",
	redirectStdErr: false
});

try {
	await cmd.run();
	console.log(cmd.stdout);	
} catch (err) {
	console.log(err.message);
	console.log(cmd.stderr);
}
```

*stderr* will contain the script error output

```
Exited with code 2
ls: cannot access 'somefilethatneverexistedhereee': No such file or directory

```

