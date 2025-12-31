# 🚀 AEVON Console - macOS Quick Start

## One-Command Setup

```bash
# 1. Clone
git clone https://github.com/MishalHQ/aevon-console.git
cd aevon-console

# 2. Make scripts executable
chmod +x setup.sh start.sh stop.sh fix.sh

# 3. Run setup (installs everything)
./setup.sh

# 4. Start application
./start.sh
```

## Requirements

- **Node.js v20 LTS** (critical for M1/M2 compatibility)
- macOS 10.15 or later

## Install Node v20

**Using nvm (recommended):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20
```

**Using Homebrew:**
```bash
brew install node@20
brew link node@20 --force
```

## Access Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5001
- **Login:** admin@aevon.com / admin123

## Utility Commands

```bash
./setup.sh   # Complete setup (clean + install)
./start.sh   # Start both servers
./stop.sh    # Stop all servers
./fix.sh     # Quick fix common issues
```

## Common Issues

### Port in use?
```bash
./fix.sh
```

### Wrong Node version?
```bash
nvm use 20
./setup.sh
```

### API not connecting?
```bash
./stop.sh
./fix.sh
./start.sh
```

## Full Documentation

- [Complete macOS Setup Guide](MACOS_SETUP.md)
- [Full README](README.md)
- [API Documentation](API.md)

---

**Need help?** Check [MACOS_SETUP.md](MACOS_SETUP.md) for detailed troubleshooting.