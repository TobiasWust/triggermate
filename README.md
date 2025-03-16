# TriggerMate - Automates tasks based on file updates

TriggerMate is a VSCode extension that watches for file changes and automatically executes predefined commands. This helps streamline workflows by ensuring necessary scripts run whenever critical files are updated.

## 🚀 Features

- Monitor files for changes.
- Execute custom commands automatically.
- Seamlessly integrates into any VSCode workspace.

## 🎯 Use Cases

- Run `npm ci` when `package.json` changes.
- Automatically install dependencies when `pyproject.toml` updates.
- Trigger custom scripts based on file modifications.

## ⚙️ Configuration Options

TriggerMate provides flexible configuration options to control its behavior. Below are the supported properties:

### `triggerMate.fileTriggers`

Defines the list of files to watch and commands to run.

#### Properties:

- **`file`** _(string, required)_ – The path to the file relative to the workspace.
- **`command`** _(string, optional)_ – The command to execute when the file changes.
- **`autoExecute`** _(boolean, optional, default: false)_ – If `true`, the command runs automatically without prompting the user.

#### Examples:

1️⃣ **Basic File Notification (No Command Execution)**

```json
{
  "triggerMate.fileTriggers": [{ "file": "README.md" }]
}
```

📌 _Triggers a notification when `README.md` changes._

![Notification Demo](images/notification.gif)

2️⃣ **Prompted Command Execution**

```json
{
  "triggerMate.fileTriggers": [
    {
      "file": "package.json",
      "command": "npm install"
    }
  ]
}
```

📌 _Notifies the user and asks if they want to run `npm install` when `package.json` updates._

![Prompt Demo](images/prompt.gif)

3️⃣ **Automatic Command Execution**

```json
{
  "triggerMate.fileTriggers": [
    {
      "file": "pyproject.toml",
      "command": "poetry install",
      "autoExecute": true
    }
  ]
}
```

📌 _Runs `poetry install` automatically when `pyproject.toml` changes._

![Auto Demo](images/auto.gif)

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
