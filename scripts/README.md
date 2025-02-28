# Helper Scripts for Rocky Mountain Weddings Project

This directory contains helper scripts that can be suggested by AI assistants and executed by you.

## Available Scripts

### `open-terminal.ps1`
Opens Windows Terminal in the project directory.
```
.\scripts\open-terminal.ps1
```

### `start-project.ps1`
Starts the project using npm.
```
.\scripts\start-project.ps1
```

### `watch-media.ps1`
Watches media files for changes.
```
.\scripts\watch-media.ps1
```

### `run-command.ps1`
Runs an AI-suggested command in the project directory.
```
.\scripts\run-command.ps1 "your command here"
```

### `open-file.ps1`
Quickly opens essential project files in VS Code.
```
.\scripts\open-file.ps1 [file-type]
```

Available file types:
- `index` - Opens index.html
- `about` - Opens about.html
- `blog` - Opens blog.html
- `contact` - Opens contact.html
- `package` - Opens package.json
- `style` - Opens main style file
- `script` - Opens main JavaScript file

## How to Use with AI Assistance

1. When the AI suggests a complex command, ask for the script version
2. The AI will suggest a script command like: `.\scripts\run-command.ps1 "npm install some-package"`
3. Copy and run the command in your terminal
4. This approach minimizes errors in command syntax 