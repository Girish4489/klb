@ECHO OFF

REM Change the directory to the project folder
CD /D %~dp0
ECHO Changed directory to %~dp0

REM Check if port 3000 is in use
netstat -ano | findstr :3000 > nul
IF ERRORLEVEL 1 (
    REM Port 3000 is not in use
    echo Port 3000 is available. Proceeding...
    GOTO START_SERVER
) ELSE (
    REM Port 3000 is in use, kill the process
    FOR /F "tokens=5" %%a IN ('netstat -aon ^| findstr :3000') DO (
        taskkill /PID %%a /F > nul
    )
    echo Process running on port 3000 killed.
    GOTO START_SERVER
)

REM Start the server
:START_SERVER

IF EXIST ".next\" (
  echo Build folder found. Starting server...
  start /B npm run dev
  echo Server started.
  GOTO EXIT_SCRIPT
) ELSE (
  echo Build folder not found. Building project...
  npm run build
  echo Build complete. Starting server...
  GOTO START_SERVER
)

REM Exit the script and close the terminal
GOTO EXIT_SCRIPT

:EXIT_SCRIPT

REM Pause to allow the server to start and exit the script
ECHO Exiting the script in 5 seconds...
FOR /L %%i IN (5,-1,1) DO (
    ECHO %%i
    timeout /t 1 >nul
)
exit
