// src/extension.ts
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let lastFileHashes: { [key: string]: string } = {};

export function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found.');
    return;
  }

  const gitAPI = gitExtension.getAPI(1);
  gitAPI.repositories.forEach((repo: any) => {
    repo.state.onDidChange(() => checkFilesChange(repo));
  });
}

function checkFilesChange(repo: any) {
  const config = vscode.workspace.getConfiguration('gitTriggered');
  const packagesToNotify = config.get<{ file: string; command: string }[]>(
    'packagesToNotify',
    []
  );

  packagesToNotify.forEach((entry) => {
    const filePath = path.join(repo.rootUri.fsPath, entry.file);

    if (!fs.existsSync(filePath)) {
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const currentHash = hashString(fileContent);

    if (
      lastFileHashes[entry.file] &&
      lastFileHashes[entry.file] !== currentHash
    ) {
      vscode.window
        .showInformationMessage(
          `${entry.file} has changed. Run the <${entry.command}>?`,
          'Yes',
          'No'
        )
        .then((selection) => {
          if (selection === 'Yes') {
            runCommand(entry.command, repo.rootUri.fsPath);
          }
        });
    }
    lastFileHashes[entry.file] = currentHash;
  });
}

function hashString(content: string): string {
  return require('crypto').createHash('sha256').update(content).digest('hex');
}

function runCommand(command: string, workspacePath: string) {
  const terminal = vscode.window.createTerminal('File Change Notifier');
  terminal.sendText(`cd ${workspacePath} && ${command}`);
  terminal.show();
}

export function deactivate() {}
