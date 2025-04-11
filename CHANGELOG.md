# Change Log

All notable changes to the "TriggerMate" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.3.3]

- Add more typescript type details.
- Add ability to configure tasks.
- Update configuration fo tasks
```
{
  // configure events to monitor for
  ignoreCreateEvents?: boolean,
  ignoreChangeEvents?: boolean,
  ignoreDeleteEvents?: boolean,

  // configure task or terminal (default)
  commandType?: "task" | "terminal",

  // number of milliseconds to wait before executing another task
  commandDebounce?: number,

  // use glob pattern to configure multiple file types
  file: "**/*.{c,cpp,h}"
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
