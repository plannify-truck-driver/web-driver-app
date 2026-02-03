# Driver Web App

This repository contains the web application for drivers. It is built using React and TypeScript.

## Prerequisites

- Node.js (version 14 or higher)
- pnpm or npm

## Installation

1. Clone the repository:

```bash
git clone git@github.com:plannify-truck-driver/web-driver-app.git
cd web-driver-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

The web application will be available at `http://localhost:5173`.

## Code Formatting with Prettier

This project uses **Prettier** to maintain consistent code formatting across the codebase.

### Configuration

The Prettier configuration is located in the `.prettierrc` file at the root of the project.

### Setup in VS Code

To automatically format your code on save:

1. Install the **Prettier - Code formatter** extension in VS Code
2. Set Prettier as your default formatter:
   - Open VS Code Settings (Ctrl+, or Cmd+,)
   - Search for "Default Formatter"
   - Select **Prettier - Code formatter** from the dropdown
3. Enable "Format On Save" in VS Code settings

### Format Command

You can manually format the entire codebase by running:

```bash
pnpm run format
```

This command will format all TypeScript, JavaScript, JSON, and CSS files in the `src/` directory according to the rules defined in `.prettierrc`.
