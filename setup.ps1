# Define color codes for text
$COLOR_INFO = "Cyan"
$COLOR_WARNING = "Yellow"
$COLOR_SUCCESS = "Green"

# Function to print colored messages
function Write-Color {
    param (
        [string]$Color,
        [string]$Message
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to check version
function Get-Version {
    param (
        [string]$Command
    )
    $version = & $Command --version
    Write-Color -Color $COLOR_INFO -Message "$Command version: $version"
}

# Get the path of the current script
$SCRIPT_PATH = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Color -Color $COLOR_INFO -Message "Script path: $SCRIPT_PATH"

# Get the path to the desktop folder
$DESKTOP_PATH = [Environment]::GetFolderPath("Desktop")
Write-Color -Color $COLOR_INFO -Message "Desktop path: $DESKTOP_PATH"

# Create a shortcut for the script and set its icon
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut("$DESKTOP_PATH\Kalamandir Server.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$SCRIPT_PATH\start.ps1`""
$Shortcut.IconLocation = "$SCRIPT_PATH\public\icons\logo\favicon.ico"
$Shortcut.Save()
Write-Color -Color $COLOR_SUCCESS -Message "Shortcut created on the desktop."

# Check for Node.js installation
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Color -Color $COLOR_SUCCESS -Message "Node.js is installed."
    Get-Version -Command "node"
    Write-Color -Color $COLOR_INFO -Message "Checking for package managers installation..."
} else {
    Write-Color -Color $COLOR_WARNING -Message "WARNING: Node.js not found in system PATH."
    # Check for nvm installation
    if (Get-Command nvm -ErrorAction SilentlyContinue) {
        Write-Color -Color $COLOR_SUCCESS -Message "nvm is installed. Installing Node.js using nvm..."
        nvm install
        nvm use
    } elseif (Get-Command fnm -ErrorAction SilentlyContinue) {
        Write-Color -Color $COLOR_SUCCESS -Message "fnm is installed. Installing Node.js using fnm..."
        fnm install
    } else {
        Write-Color -Color $COLOR_WARNING -Message "WARNING: Neither Node.js, nvm, nor fnm found in system PATH."
        Write-Color -Color $COLOR_INFO -Message "Please visit https://nodejs.org/en/download/ for installation instructions."
        exit 1
    }
}

# Check for package managers installation
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Color -Color $COLOR_SUCCESS -Message "npm is installed."
    Get-Version -Command "npm"
} else {
    Write-Color -Color $COLOR_WARNING -Message "WARNING: npm not found in system PATH."
}

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Color -Color $COLOR_SUCCESS -Message "pnpm is installed."
    Get-Version -Command "pnpm"
} else {
    Write-Color -Color $COLOR_WARNING -Message "WARNING: pnpm not found in system PATH."
}

Write-Color -Color $COLOR_INFO -Message "Please choose the package manager to use:"
Write-Color -Color $COLOR_INFO -Message "1. npm"
Write-Color -Color $COLOR_INFO -Message "2. pnpm"
$CHOICE = Read-Host "Enter your choice (1 or 2)"

switch ($CHOICE) {
    "1" {
        Write-Color -Color $COLOR_INFO -Message "Using npm to install dependencies..."
        npm install
    }
    "2" {
        Write-Color -Color $COLOR_INFO -Message "Using pnpm to install dependencies..."
        pnpm install
    }
    default {
        Write-Color -Color $COLOR_WARNING -Message "Invalid choice. Exiting..."
        exit 1
    }
}

Write-Color -Color $COLOR_SUCCESS -Message "Dependencies installed successfully."
exit 0
