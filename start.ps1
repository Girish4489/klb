# Change the directory to the project folder
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Path)
Write-Host "Changed directory to $(Get-Location)"

# Pull the latest code from the main branch of the Git repository
Write-Host "Pulling the latest code from the main branch..."
git -C . pull https://github.com/Girish4489/klb.git main

# Check if the git pull was successful
if ($LASTEXITCODE -ne 0) {
  Write-Host "Git pull failed. Please check your connection or repository access."
  exit 1
}

# Check if port 3000 is in use
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
  # Port 3000 is in use, kill the process
  Write-Host "Port 3000 is in use. Killing the process..."
  $processId = ($portInUse | Select-Object -ExpandProperty OwningProcess)
  Stop-Process -Id $processId -Force
  Write-Host "Process running on port 3000 killed."
}
else {
  # Port 3000 is not in use
  Write-Host "Port 3000 is available. Proceeding..."
}

# Start the server
function Start-Server {
  if (Test-Path ".next") {
    Write-Host "Build folder found. Starting server..."
    Start-Process -NoNewWindow -FilePath "npm.cmd" -ArgumentList "run dev"
    Write-Host "Server started."
  }
  else {
    Write-Host "Build folder not found. Building project..."
    npm run build
    Write-Host "Build complete. Starting server..."
    Start-Server
  }
}

Start-Server

# Exit the script and close the terminal
Write-Host "Exiting the script in 5 seconds..."
for ($i = 5; $i -ge 1; $i--) {
  Write-Host "$i"
  Start-Sleep -Seconds 1
}
exit 0
