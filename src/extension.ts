import * as vscode from 'vscode';

const appName = 'TriggerMate';
const cfgName = `${appName.substring(0, 1).toLocaleLowerCase()}${appName.substring(1)}`;
const cfgProp = 'fileTriggers';

const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const outputChannel = vscode.window.createOutputChannel(appName);

type FileTriggerCommand = 'terminal' | 'task';

interface FileTrigger {
  description?: string;
  autoExecute?: boolean;

  ignoreCreateEvents?: boolean;
  ignoreChangeEvents?: boolean;
  ignoreDeleteEvents?: boolean;

  // task or terminal (default terminal)
  commandType?: FileTriggerCommand;
  // number of milliseconds to wait before command executions
  commandDebounce?: number;
  commandLastTrigger?: number;
  command: string;

  file: string;
}

// default file trigger
const defaultFileTrigger: FileTrigger = {
  autoExecute: false,

  ignoreChangeEvents: false,
  ignoreCreateEvents: true,
  ignoreDeleteEvents: true,

  commandType: 'terminal',
  commandDebounce: 0,
  commandLastTrigger: 0,
  command: '',

  file: '',
};

let watchers: vscode.FileSystemWatcher[] = [];

export function activate(context: vscode.ExtensionContext) {
  if (!workspacePath) {
    outputChannel.appendLine('No workspace folder is open.');
    return;
  }

  const resetWatchers = (): void => {
    watchers.forEach((watcher: vscode.FileSystemWatcher) => watcher.dispose());
    watchers = [];
  };
  const loadTriggers = (): FileTrigger[] | undefined => {
    const config = vscode.workspace.getConfiguration(cfgName);

    const loadedFileTriggers = config.get<FileTrigger[]>(cfgProp, []);
    if (!Array.isArray(loadedFileTriggers)) {
      outputChannel.appendLine('FileTriggers must be an array.');
      return undefined;
    }

    return loadedFileTriggers.map((fileTrigger: FileTrigger) => {
      return { ...defaultFileTrigger, ...fileTrigger };
    });
  };

  const updateWatchers = () => {
    // Dispose of existing watchers
    resetWatchers();

    const fileTriggers = loadTriggers();
    fileTriggers?.forEach((fileTrigger: FileTrigger) => {
      const { file, ignoreChangeEvents, ignoreCreateEvents, ignoreDeleteEvents } = fileTrigger;
      if (!file) {
        outputChannel.appendLine('Invalid entry in fileTriggers configuration: file property required.');
        return;
      }

      const pattern = new vscode.RelativePattern(workspacePath, file);
      const watcher: vscode.FileSystemWatcher = vscode.workspace.createFileSystemWatcher(
        pattern,
        ignoreCreateEvents,
        ignoreChangeEvents,
        ignoreDeleteEvents,
      );
      watcher.onDidChange((uri: vscode.Uri) => handleFileChange(fileTrigger, uri, 'onChange'));
      watcher.onDidCreate((uri: vscode.Uri) => handleFileChange(fileTrigger, uri, 'onCreate'));
      watcher.onDidDelete((uri: vscode.Uri) => handleFileChange(fileTrigger, uri, 'onDelete'));

      context.subscriptions.push(watcher);
      watchers.push(watcher);

      outputChannel.appendLine(
        `Wathcing [${pattern.baseUri}, ${
          pattern.pattern
        }] - (create:${!ignoreCreateEvents}, change:${!ignoreChangeEvents}, delete:${!ignoreDeleteEvents})`,
      );
    });
  };

  // Initial setup
  updateWatchers();

  // Update watchers when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
      if (e.affectsConfiguration(`${cfgName}.${cfgProp}`)) {
        updateWatchers();
      }
    }),
  );

  outputChannel.appendLine(`${appName} extension activated.`);
}

function handleFileChange(fileTrigger: FileTrigger, uri: vscode.Uri, eventName: string) {
  const { file, autoExecute, command, commandType, commandDebounce, commandLastTrigger } = fileTrigger;

  if (commandDebounce) {
    if (commandLastTrigger) {
      if (new Date().getTime() - commandLastTrigger < commandDebounce) {
        return;
      }
    }

    fileTrigger.commandLastTrigger = new Date().getTime();
  }

  if (!workspacePath) {
    outputChannel.appendLine('No workspace path available.');
    return;
  }
  if (!command) {
    vscode.window.showErrorMessage(`No command specified for this ${file} trigger.`);
    return;
  }

  if (autoExecute) {
    vscode.window.showInformationMessage(`${file} has changed. Running \`${command}\`.`);
    if (commandType === 'task') {
      runTask(fileTrigger, uri, eventName);
    } else {
      runCommand(fileTrigger, uri, eventName);
    }
  } else {
    vscode.window.showInformationMessage(`${file} has changed. Run \`${command}\`?`, 'Yes', 'No').then((selection) => {
      if (selection === 'Yes') {
        if (commandType === 'task') {
          runTask(fileTrigger, uri, eventName);
        } else {
          runCommand(fileTrigger, uri, eventName);
        }
      }
    });
  }
}

function runCommand(fileTrigger: FileTrigger, uri: vscode.Uri, eventName: string) {
  const { command, file } = fileTrigger;

  try {
    const terminal = vscode.window.createTerminal(appName);
    terminal.sendText(`cd ${workspacePath} && ${command}`);
    terminal.show();
    outputChannel.appendLine(`Running command: ${command} for ${file} at ${uri} on ${eventName}`);
  } catch (error) {
    outputChannel.appendLine(`Error running command: ${error}`);
  }
}

function runTask(fileTrigger: FileTrigger, uri: vscode.Uri, eventName: string) {
  const { command, file } = fileTrigger;

  vscode.tasks.fetchTasks().then((availableTasks: vscode.Task[]) => {
    availableTasks.forEach((task: vscode.Task) => {
      if (task.name === command) {
        outputChannel.appendLine(`Running task: ${command} for ${file} at ${uri} on ${eventName}`);
        vscode.tasks.executeTask(task);
      }
    });
  });
}

export function deactivate() {
  outputChannel.appendLine(`${appName} extension deactivated.`);
  // Dispose of all watchers
  watchers.forEach((watcher) => watcher.dispose());
}
