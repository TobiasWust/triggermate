# Change Log

## [0.4.0]

- **Task Support**: Added the ability to execute VSCode tasks as part of file triggers.
- **Event Filtering**: Introduced options to ignore specific file events (`create`, `change`, `delete`) for more granular control.
- **Enhanced Output**: Improved the output channel with detailed information about active watchers and triggered events.
- **Debounce Feature**: Added support for debouncing commands to prevent rapid consecutive executions.

### Example Configuration:

```json
{
  "commandType": "task", // Execute as a VSCode task (default: "terminal")

  "ignoreCreateEvents": true, // Ignore file creation events
  "ignoreChangeEvents": false, // Monitor file changes
  "ignoreDeleteEvents": true, // Ignore file deletions

  "commandDebounce": 500 // Wait 500ms before executing the next command
}
```

## [0.3.2]

- Mention glob pattern matching in README.
- More keywords.

## [0.3.1]

- Added Demo Gifs to README.

## [0.3.0]

- Added support for an empty command in configuration, resulting in just a notification.

## [0.2.0]

- Added support for wildcard file paths.
- Added `autoExecute` property to `fileTriggers` configuration to automatically execute commands without confirmation.

## [Unreleased]

- Initial release
