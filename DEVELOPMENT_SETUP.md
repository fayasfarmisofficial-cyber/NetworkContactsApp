# Complete Development Environment Setup Guide

## 🚀 Essential Development Tools (Install First)

### 1. Node.js & npm
- **What it is**: JavaScript runtime + package manager
- **Download**: https://nodejs.org/ (Choose LTS version)
- **Why**: Required for React, Vue, Angular, and most modern web development
- **Verify**: `node --version` and `npm --version`

### 2. Git
- **What it is**: Version control system
- **Download**: https://git-scm.com/download/mac (or comes with Xcode Command Line Tools)
- **Or install via**: `xcode-select --install`
- **Why**: Essential for tracking code changes and collaboration
- **Verify**: `git --version`
- **Configure after install**:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 3. Code Editor (Choose one or more)

#### Option A: VS Code (Most Popular)
- **Download**: https://code.visualstudio.com/
- **Recommended Extensions**:
  - ESLint
  - Prettier
  - GitLens
  - Auto Rename Tag
  - Path Intellisense
  - ES7+ React/Redux/React-Native snippets

#### Option B: Cursor (AI-powered, what you're using)
- **Download**: https://cursor.sh/
- Already installed!

#### Option C: WebStorm (Paid, powerful)
- **Download**: https://www.jetbrains.com/webstorm/

---

## 🎨 Frontend Development Stacks

### React (What we just built)
- **Installed with**: Node.js projects
- **Create new project**: `npx create-react-app my-app` or `npm create vite@latest`

### Vue.js
- **Install globally**: `npm install -g @vue/cli`
- **Create project**: `vue create my-app`

### Angular
- **Install globally**: `npm install -g @angular/cli`
- **Create project**: `ng new my-app`

### Svelte
- **Create project**: `npm create svelte@latest my-app`

---

## 🗄️ Backend Development Stacks

### Python
- **Download**: https://www.python.org/downloads/
- **Why**: Great for backend, data science, AI/ML
- **Package manager**: `pip` (comes with Python)

### Java
- **Download JDK**: https://www.oracle.com/java/technologies/downloads/
- **Or use**: OpenJDK (free) or via Homebrew

### Go (Golang)
- **Download**: https://go.dev/dl/
- **Why**: Fast, modern backend language

### .NET (C#)
- **Download**: https://dotnet.microsoft.com/download
- **Why**: Microsoft stack, cross-platform now

---

## 🗃️ Databases

### PostgreSQL
- **Download**: https://www.postgresql.org/download/macosx/
- **Or install via**: Homebrew (see below)
- **GUI Tool**: pgAdmin or DBeaver

### MySQL
- **Download**: https://dev.mysql.com/downloads/mysql/
- **Or install via**: Homebrew

### MongoDB
- **Download**: https://www.mongodb.com/try/download/community
- **GUI Tool**: MongoDB Compass

### SQLite
- **Comes with**: macOS (already installed)
- **GUI Tool**: DB Browser for SQLite

### Redis (Caching)
- **Install via**: Homebrew (see below)

---

## 🛠️ Package Managers & Tools

### Homebrew (macOS Package Manager)
- **What it is**: The missing package manager for macOS
- **Install**:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- **Why**: Easy installation of command-line tools and software
- **After install, you can easily install**:
  ```bash
  brew install node          # Node.js
  brew install python        # Python
  brew install postgresql    # PostgreSQL
  brew install mysql         # MySQL
  brew install redis         # Redis
  brew install git           # Git
  brew install docker        # Docker
  ```

### Yarn (Alternative to npm)
- **Install**: `npm install -g yarn`
- **Why**: Faster than npm, better dependency resolution

### pnpm (Another npm alternative)
- **Install**: `npm install -g pnpm`
- **Why**: Disk space efficient, fast

---

## 🐳 Containerization

### Docker Desktop
- **Download**: https://www.docker.com/products/docker-desktop
- **Why**: Run applications in containers, essential for modern dev workflows
- **Verify**: `docker --version`

### Kubernetes (Optional, advanced)
- **Install**: via Docker Desktop (includes Kubernetes)

---

## 📱 Mobile Development

### React Native (Cross-platform)
- **Prerequisites**: Node.js
- **Install**: `npm install -g react-native-cli`
- **iOS**: Requires Xcode (from App Store, free but large ~12GB)
- **Android**: Requires Android Studio

### Flutter (Cross-platform)
- **Download**: https://docs.flutter.dev/get-started/install/macos
- **Why**: Google's framework for iOS, Android, Web

---

## 🔧 Development Utilities

### Terminal Enhancements
- **iTerm2** (Better terminal): https://iterm2.com/
- **Oh My Zsh** (Enhanced shell):
  ```bash
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  ```

### API Testing
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **Or use**: REST Client extension in VS Code

### Database GUI Tools
- **DBeaver** (Universal): https://dbeaver.io/download/
- **TablePlus** (Modern, paid): https://tableplus.com/
- **Sequel Pro** (MySQL only, free): https://www.sequelpro.com/

### Design Tools
- **Figma** (UI/UX design): https://www.figma.com/downloads/
- **Sketch** (macOS only, paid)

---

## 🧪 Testing & Quality Tools

### Testing Frameworks (Install as needed per project)
- **Jest**: `npm install -g jest` (React testing)
- **Cypress**: For E2E testing
- **Playwright**: Modern E2E testing

### Code Quality
- **ESLint**: Comes with projects
- **Prettier**: Code formatter

---

## 📦 Recommended Installation Order

### Phase 1: Essentials (Do this first)
1. ✅ **Node.js** - https://nodejs.org/
2. ✅ **Git** - https://git-scm.com/download/mac
3. ✅ **VS Code or Cursor** - Already have Cursor!
4. ✅ **Homebrew** - Makes installing everything else easier

### Phase 2: Based on What You Want to Build

#### For Web Development (Frontend):
- Node.js ✅
- Git ✅
- Code Editor ✅
- That's it to start!

#### For Full-Stack Web Development:
- Everything from Phase 1
- PostgreSQL or MySQL
- Docker (optional but recommended)

#### For Mobile Development:
- Everything from Phase 1
- Xcode (for iOS) - Free from App Store
- Android Studio (for Android) - Free

#### For Data Science / AI:
- Python
- Jupyter Notebook: `pip install jupyter`
- Anaconda (optional): https://www.anaconda.com/

---

## ✅ Quick Verification Commands

After installing, verify everything works:

```bash
# Node.js
node --version
npm --version

# Git
git --version

# Python (if installed)
python3 --version
pip3 --version

# Homebrew (if installed)
brew --version

# Docker (if installed)
docker --version
```

---

## 🎯 Minimal Setup for Web Development

**Absolute minimum to start building web apps:**
1. Node.js (npm included)
2. Git
3. Code Editor (Cursor/VS Code)

That's it! You can build React, Vue, Angular apps with just these three.

---

## 📚 Learning Resources

- **MDN Web Docs**: https://developer.mozilla.org/
- **freeCodeCamp**: https://www.freecodecamp.org/
- **Stack Overflow**: https://stackoverflow.com/
- **GitHub**: https://github.com/

---

## 💡 Pro Tips

1. **Use nvm for Node.js**: Better version management
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Use pyenv for Python**: Better version management
   ```bash
   brew install pyenv
   ```

3. **Configure Git properly** (do this first):
   ```bash
   git config --global init.defaultBranch main
   git config --global core.editor "code --wait"  # or "cursor --wait"
   ```

4. **Set up SSH keys for GitHub**:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Then add to GitHub: Settings > SSH and GPG keys
   ```

---

## 🚀 Start Building!

Once you have Node.js, Git, and your code editor, you're ready to build web applications!

For this Network Contacts project, you just need:
- ✅ Node.js (install now!)
- ✅ Git (probably already on your Mac)
- ✅ Cursor (already have it!)






