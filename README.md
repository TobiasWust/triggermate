# Git Triggered

Git Triggered is a Visual Studio Code extension that monitors specified files in your Git repositories for changes. When a change is detected, it prompts you to run an associated command.

## Features

- Monitors specified files for changes in Git repositories.
- Prompts the user to run a command when a change is detected.
- Configurable through VS Code settings.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/gittriggered.git
   ```

2. Open the cloned repository in Visual Studio Code.

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Press `F5` to start debugging the extension.

## Configuration

You can configure the extension through the VS Code settings. Add the following configuration to your `settings.json`:

<<<json
"gitTriggered.packagesToNotify": [
{
"file": "path/to/file",
"command": "your-command"
}
]

> > >

- `file`: The relative path to the file you want to monitor.
- `command`: The command to run when the file changes.

## Usage

1. Open a Git repository in Visual Studio Code.
2. Make sure the Git extension is enabled.
3. Configure the files and commands you want to monitor in your `settings.json`.
4. When a monitored file changes, you will be prompted to run the associated command.

## Example

Here is an example configuration:

```json
"gitTriggered.packagesToNotify": [
  {
    "file": "src/index.js",
    "command": "npm run build"
  },
  {
    "file": "README.md",
    "command": "echo 'README changed'"
  }
]
```

In this example, when `src/index.js` changes, the `npm run build` command will be run. When `README.md` changes, the `echo 'README changed'` command will be run.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
