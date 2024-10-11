#!/bin/bash

# Define color codes for text (ANSI escape codes)
COLOR_INFO="\033[0;32m"  # Green
COLOR_WARNING="\033[0;33m"  # Yellow
COLOR_SUCCESS="\033[0;34m"  # Blue
COLOR_RESET="\033[0m"

# Get the path of the current script
SCRIPT_PATH=$(dirname "$0")
echo -e "${COLOR_INFO}Script path: $SCRIPT_PATH${COLOR_RESET}"

# Get the path to the desktop folder
DESKTOP_PATH=~/Desktop
echo -e "${COLOR_INFO}Desktop path: $DESKTOP_PATH${COLOR_RESET}"

# Create a desktop shortcut
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux: Create a .desktop file for the script
  cat <<EOF >"$DESKTOP_PATH/Kalamandir_Server.desktop"
[Desktop Entry]
Name=Kalamandir Server
Exec=$SCRIPT_PATH/start.sh
Icon=$SCRIPT_PATH/public/icons/logo/favicon.ico
Type=Application
EOF
  chmod +x "$DESKTOP_PATH/Kalamandir_Server.desktop"
  echo -e "${COLOR_SUCCESS}Shortcut created on the desktop.${COLOR_RESET}"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS: Use AppleScript to create a shortcut (if needed)
  echo "macOS shortcut creation would go here"
else
  echo -e "${COLOR_WARNING}Shortcut creation not supported on this platform.${COLOR_RESET}"
fi

# Check for Node.js installation
if command -v node > /dev/null 2>&1; then
  echo -e "${COLOR_SUCCESS}Node.js is installed.${COLOR_RESET}"
  node --version
else
  echo -e "${COLOR_WARNING}Node.js not found in system PATH.${COLOR_RESET}"
  echo -e "${COLOR_INFO}Please visit https://nodejs.org/en/download/ for installation instructions.${COLOR_RESET}"
  exit 1
fi

# Check for npm, pnpm installations and install dependencies
check_package_manager() {
  if command -v "$1" > /dev/null 2>&1; then
    echo -e "${COLOR_SUCCESS}$1 is installed.${COLOR_RESET}"
    "$1" --version
  else
    echo -e "${COLOR_WARNING}$1 not found in system PATH.${COLOR_RESET}"
  fi
}

check_package_manager npm
check_package_manager pnpm

# Prompt user to choose package manager
echo -e "${COLOR_INFO}Please choose the package manager to use:${COLOR_RESET}"
echo -e "${COLOR_INFO}1. npm${COLOR_RESET}"
echo -e "${COLOR_INFO}2. pnpm${COLOR_RESET}"
read -p "Enter your choice (1 or 2): " CHOICE

case "$CHOICE" in
  1) echo -e "${COLOR_INFO}Using npm to install dependencies...${COLOR_RESET}"
     npm install ;;
  2) echo -e "${COLOR_INFO}Using pnpm to install dependencies...${COLOR_RESET}"
     pnpm install ;;
  *) echo -e "${COLOR_WARNING}Invalid choice. Exiting...${COLOR_RESET}"
     exit 1 ;;
esac

echo -e "${COLOR_SUCCESS}Dependencies installed successfully.${COLOR_RESET}"
