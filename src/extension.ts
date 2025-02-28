import * as path from 'path';
import * as vscode from 'vscode';

const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const outputChannel = vscode.window.createOutputChannel('TriggerMate');
let watchers: vscode.FileSystemWatcher[] = [];

export function activate(context: vscode.ExtensionContext) {
  if (!workspacePath) {
    outputChannel.appendLine('No workspace folder is open.');
    return;
  }

  const updateWatchers = () => {
    // Dispose of existing watchers
    watchers.forEach((watcher) => watcher.dispose());
    watchers = [];

    const config = vscode.workspace.getConfiguration('triggerMate');
    const fileTriggers = config.get<{ file: string; command: string }[]>(
      'fileTriggers',
      []
    );

    if (!Array.isArray(fileTriggers)) {
      outputChannel.appendLine('Invalid configuration for fileTriggers.');
      return;
    }

    fileTriggers.forEach((entry) => {
      if (!entry.file || !entry.command) {
        outputChannel.appendLine(
          'Invalid entry in fileTriggers configuration.'
        );
        return;
      }

      const filePath = path.join(workspacePath, entry.file);

      const watcher = vscode.workspace.createFileSystemWatcher(filePath);
      watcher.onDidChange(() => handleFileChange(entry));
      watcher.onDidCreate(() => handleFileChange(entry));
      watcher.onDidDelete(() => handleFileChange(entry));

      context.subscriptions.push(watcher);
      watchers.push(watcher);
      outputChannel.appendLine(`Watching ${filePath}...`);
    });
  };

  // Initial setup
  updateWatchers();

  // Update watchers when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('triggerMate.fileTriggers')) {
        updateWatchers();
      }
    })
  );

  outputChannel.appendLine('TriggerMate extension activated.');
}

function handleFileChange(entry: {
  file: string;
  command: string;
  autoExecute?: boolean;
}) {
  if (!workspacePath) {
    outputChannel.appendLine('No workspace path available.');
    return;
  }

  if (entry.autoExecute) {
    vscode.window.showInformationMessage(
      `${entry.file} has changed. Running \`${entry.command}\`.`
    );
    runCommand(entry.command, workspacePath);
  } else {
    vscode.window
      .showInformationMessage(
        `${entry.file} has changed. Run \`${entry.command}\`?`,
        'Yes',
        'No'
      )
      .then((selection) => {
        if (selection === 'Yes') {
          runCommand(entry.command, workspacePath);
        }
      });
  }
}

function runCommand(command: string, workspacePath: string) {
  try {
    const terminal = vscode.window.createTerminal('TriggerMate');
    terminal.sendText(`cd ${workspacePath} && ${command}`);
    terminal.show();
    outputChannel.appendLine(`Running command: ${command}`);
  } catch (error) {
    outputChannel.appendLine(`Error running command: ${error}`);
  }
}

export function deactivate() {
  outputChannel.appendLine('TriggerMate extension deactivated.');
  // Dispose of all watchers
  watchers.forEach((watcher) => watcher.dispose());
}
