@ECHO OFF

:START

REM Get the path of the current script
SET "SCRIPT_PATH=%~dp0"
ECHO Script path: %SCRIPT_PATH%

REM Get the path to the desktop folder
SET "DESKTOP_PATH=%USERPROFILE%\Desktop"
ECHO Desktop path: %DESKTOP_PATH%

REM Create a shortcut for the script and set its icon
powershell -Command "$WScriptShell = New-Object -ComObject WScript.Shell; $Shortcut = $WScriptShell.CreateShortcut('%DESKTOP_PATH%\Kalamandir Server.lnk'); $Shortcut.TargetPath = '%SCRIPT_PATH%\start_npm.bat'; $Shortcut.IconLocation = '%SCRIPT_PATH%\public\icons\logo\favicon.ico'; $Shortcut.Save()"
ECHO Shortcut created on the desktop.

REM Check for Node.js installation
WHERE node.exe > NUL 2>&1 (
  ECHO Node.js is installed.
  ECHO Checking for Yarn installation...
  REM Jump to the next step if Node.js is installed
  GOTO CHECK_YARN
) ELSE (
  ECHO WARNING: Node.js not found in system PATH. You will need Node.js to run this application.
  ECHO Please visit https://nodejs.org/en/download/ for installation instructions.
  EXIT /B 1
)

:CHECK_YARN

REM Check for npm installation
WHERE npm.exe > NUL 2>&1 (
  ECHO npm is installed.
  ECHO Checking for dependencies...

  REM Jump to the next step if Yarn is installed
  GOTO CHECK_ENV

) ELSE (
  ECHO WARNING: Yarn is not installed. Installing Yarn using npm...
  npm install -g yarn
  REM Jump back to the beginning of the script to check Node.js and Yarn installation again
  ECHO Updating Yarn to the latest stable version...
@REM   yarn set version stable
  npm install
  ECHO Yarn updated to the latest stable version.
  GOTO CHECK_ENV
)

:CHECK_ENV

IF EXIST ".env" (
  echo .env file found.
  GOTO CHECK_DEPENDENCIES
) ELSE (
  echo WARNING: .env file not found.
  echo You might need to create one for environment variables.
  GOTO CHECK_DEPENDENCIES
)

:CHECK_DEPENDENCIES

REM Install dependencies if node_modules folder is not found
IF NOT EXIST "node_modules" (
  echo Installing dependencies...
  npm install
  npm fund
  echo Installation complete.
@REM   GOTO EXIT_SCRIPT
) ELSE (
  echo Dependencies found. Skipping installation.
@REM   GOTO EXIT_SCRIPT
)

@REM :EXIT_SCRIPT

@REM REM Pause to allow the server to start
@REM timeout /t 5 >nul

@REM REM Exit the script and close the terminal
@REM EXIT /B

