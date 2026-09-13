# 🌌 Aether Studio

[![Windows Desktop App](https://github.com/aether-foundry/aether/actions/workflows/build-windows.yml/badge.svg)](.github/workflows/build-windows.yml)
[![Multi-Platform Matrix](https://github.com/aether-foundry/aether/actions/workflows/build-desktop-matrix.yml/badge.svg)](.github/workflows/build-desktop-matrix.yml)
[![Build Status](https://img.shields.io/badge/build-passing-emerald.svg)](.github/workflows/ci.yml)
[![Type Safety](https://img.shields.io/badge/types-strict%20tsgo-cyan.svg)](package.json)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

> **Aether Studio** is an autonomous neural software foundry and desktop engine. Build, iterate, and deploy full-stack modern web and desktop applications using intelligent neural models, real-time sandboxed preview, and automated cross-platform compilation.

---

## ⚡ Core Capabilities

- 🤖 **Autonomous Neural Agents**: Multi-model orchestration supporting Claude 3.7 Sonnet, GPT-4o, Gemini 2.5 Flash, DeepSeek V3, and offline Ollama.
- 🔮 **Four Operational Modes**:
  - **Autonomous Agent**: Executes full end-to-end file reads, diff patches, dependency installs, and strict type verification.
  - **Neural Synthesis (Build)**: Rapid prototyping and direct code modifications with live hot reloading.
  - **Deep Cognition (Ask)**: Architectural analysis and codebase queries without mutating disk state.
  - **Quantum Architect (Plan)**: Generates structured architectural blueprints before code generation.
- 🛡️ **Zero-Telemetry Local Privacy**: Connect directly to your own provider API keys or run 100% locally with private Ollama models.
- ⚡ **Instant In-Memory Sandbox**: Live preview runtime with responsive viewport simulation (Desktop, Tablet, Mobile) and console telemetry.
- 🪟 **Continuous Desktop Matrix**: Automated CI/CD pipeline building Windows (`.exe` & `.zip`), macOS (`.dmg`), and Linux (`.deb` & `.AppImage`) on every commit.

---

## 📦 Desktop Downloads & Continuous Builds

Aether is packaged for all major operating systems. Every commit produces verified standalone binaries:

| Platform | Format | Distribution | Build Pipeline |
| :--- | :--- | :--- | :--- |
| **Windows 10 / 11 (x64)** | `.exe` / `.zip` | Setup Installer & Standalone Portable | Per-commit automated CI |
| **macOS (Apple Silicon / Intel)** | `.dmg` / `.zip` | Universal Mach-O Binary | Multi-platform matrix |
| **Linux (x64)** | `.deb` / `.AppImage` | Debian, Ubuntu & Universal AppImage | Linux CI runner |

### 🚀 Getting Artifacts
1. **GitHub Releases**: Download official tagged releases and nightly builds from the Releases tab.
2. **GitHub Actions Artifacts**: Visit the Actions tab on any branch or pull request to download fresh continuous builds for any commit (`Dyad-Windows-x64-<sha>`).

---

## 🛠️ Quick Start

### Prerequisites
- Node.js `v24.13.1` or newer
- npm `11.8.0` or newer

### Local Development
```bash
# Clone the repository
git clone https://github.com/aether-foundry/aether.git
cd aether

# Install dependencies
npm ci

# Start the local development server (Port 3000)
npm run dev
```

### Desktop Packaging
```bash
# Compile and package for Windows
npm run make -- --platform win32 --arch x64

# Package for all platforms
npm run package
```

### Verification Checks
```bash
# Fast linting via oxlint
npm run lint

# Strict typechecking via tsgo
npm run ts

# Automated unit tests via vitest
npm test
```

---

## 📄 License

Licensed under the **Apache License 2.0**. See [LICENSE](./LICENSE) for details.
