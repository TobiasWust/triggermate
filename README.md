# TriggerMate - Automates tasks based on file updates

TriggerMate is a VSCode extension that watches for file changes and automatically executes predefined commands. This helps streamline workflows by ensuring necessary scripts run whenever critical files are updated.

## 🚀 Features

- Monitor files for changes.
- Execute custom commands automatically.
- Seamlessly integrates into any VSCode workspace.

## 🔧 Configuration

Configure TriggerMate in your workspace settings (`.vscode/settings.json`). Define the files to watch and the commands to execute:

```json
{
  "triggerMate.fileTriggers": [
    {
      "file": "frontend/package.json",
      "command": "cd frontend && npm ci"
    },
    {
      "file": "pyproject.toml",
      "command": "poetry install"
    },
    {
      "file": "backend/requirements.txt",
      "command": "pip install -r backend/requirements.txt",
      "autoExecute": true
    },
    {
      "file": "src/**/*.js",
      "command": "npm run lint"
    },
    {
      "file": "docs/**/*.md"
    }
  ]
}
```

## 🎯 Example Use Cases

- Run `npm ci` when `package.json` changes.
- Automatically install dependencies when `pyproject.toml` updates.
- Trigger custom scripts based on file modifications.

## 🛠️ How It Works

1. The extension detects changes in the specified files.
2. A notification prompts you to execute the associated command.
3. On confirmation, the command runs in a new terminal instance.

## 💡 Contributing

Want to improve TriggerMate? Feel free to open an issue or submit a pull request!

## 📜 License

MIT License. Free to use and modify.

---

TriggerMate – Your automation companion in VSCode! 🚀

Made with ❤️ by [Wust](https://wust.dev)
