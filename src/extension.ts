import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel('Git Triggered');
const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

export function activate(context: vscode.ExtensionContext) {
  outputChannel.appendLine('Git Triggered extension activated.');

  const config = vscode.workspace.getConfiguration('triggerMate');
  const packagesToNotify = config.get<{ file: string; command: string }[]>(
    'packagesToNotify',
    []
  );

  packagesToNotify.forEach((entry) => {
    if (!workspacePath) {
      outputChannel.appendLine(
        'No workspace folder found. Skipping file watching...'
      );
      return;
    }
    const filePath = path.join(workspacePath, entry.file);
    outputChannel.appendLine(`Watching ${filePath}...`);

    if (!fs.existsSync(filePath)) {
      outputChannel.appendLine(`File ${filePath} does not exist. Skipping...`);
      return;
    }

    const watcher = vscode.workspace.createFileSystemWatcher(filePath);
    watcher.onDidChange(() => handleFileChange(entry));
    watcher.onDidCreate(() => handleFileChange(entry));
    watcher.onDidDelete(() => handleFileChange(entry));

    context.subscriptions.push(watcher);
  });
}

function handleFileChange(entry: { file: string; command: string }) {
  if (!workspacePath) {
    outputChannel.appendLine(
      'No workspace folder found. Skipping file change handling...'
    );
    return;
  }
  vscode.window
    .showInformationMessage(
      `${entry.file} has changed. Run the <${entry.command}>?`,
      'Yes',
      'No'
    )
    .then((selection) => {
      if (selection === 'Yes') {
        runCommand(entry.command, workspacePath);
      }
    });
}

function runCommand(command: string, workspacePath: string) {
  const terminal = vscode.window.createTerminal('TriggerMate');
  terminal.sendText(`cd ${workspacePath} && ${command}`);
  terminal.show();
}

export function deactivate() {}
