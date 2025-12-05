# Script de PowerShell para crear un GIF animado de la invitación usando FFmpeg
# Uso: .\create-gif.ps1

# Configuración de colores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Verificar si FFmpeg está instalado
$ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpegCommand) {
    Write-ColorOutput "Error: FFmpeg no está instalado." "Red"
    Write-Host ""
    Write-Host "Por favor instala FFmpeg primero usando una de estas opciones:"
    Write-Host ""
    Write-Host "  Opción 1 - WinGet:"
    Write-Host "    winget install FFmpeg"
    Write-Host ""
    Write-Host "  Opción 2 - Chocolatey:"
    Write-Host "    choco install ffmpeg"
    Write-Host ""
    Write-Host "  Opción 3 - Descarga manual:"
    Write-Host "    https://ffmpeg.org/download.html"
    Write-Host ""
    Write-Host "Después de instalar, cierra y vuelve a abrir PowerShell."
    Write-Host ""
    exit 1
}

# Verificar si existe la carpeta frames
if (-not (Test-Path "frames" -PathType Container)) {
    Write-ColorOutput "Error: La carpeta 'frames' no existe." "Red"
    Write-Host ""
    Write-Host "Crea una carpeta llamada 'frames' y añade tus capturas de pantalla:"
    Write-Host "  - frame001.png"
    Write-Host "  - frame002.png"
    Write-Host "  - frame003.png"
    Write-Host "  - etc."
    Write-Host ""
    exit 1
}

# Contar archivos en la carpeta frames
$frameFiles = Get-ChildItem "frames\frame*.png" -ErrorAction SilentlyContinue
$frameCount = $frameFiles.Count

if ($frameCount -lt 2) {
    Write-ColorOutput "Error: Se necesitan al menos 2 frames en la carpeta 'frames'." "Red"
    Write-Host ""
    Write-Host "Archivos encontrados: $frameCount"
    Write-Host ""
    exit 1
}

Write-ColorOutput "✓ FFmpeg está instalado" "Green"
Write-ColorOutput "✓ Encontrados $frameCount frames" "Green"
Write-Host ""

# Configuración
$frameRate = 15
$inputPattern = "frames/frame%03d.png"
$palette = "palette.png"
$output = "out.gif"

Write-Host "Configuración:"
Write-Host "  - Entrada: $inputPattern"
Write-Host "  - Frame rate: $frameRate fps"
Write-Host "  - Salida: $output"
Write-Host ""

# Paso 1: Generar paleta de colores
Write-ColorOutput "Paso 1/2: Generando paleta de colores optimizada..." "Yellow"

try {
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList "-y", "-i", $inputPattern, "-vf", "palettegen=stats_mode=diff", $palette -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -ne 0) {
        Write-ColorOutput "Error: No se pudo generar la paleta" "Red"
        exit 1
    }
} catch {
    Write-ColorOutput "Error al ejecutar FFmpeg: $_" "Red"
    exit 1
}

if (-not (Test-Path $palette)) {
    Write-ColorOutput "Error: No se pudo generar la paleta" "Red"
    exit 1
}

Write-ColorOutput "✓ Paleta generada: $palette" "Green"
Write-Host ""

# Paso 2: Crear el GIF
Write-ColorOutput "Paso 2/2: Creando GIF animado..." "Yellow"

try {
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList "-y", "-i", $inputPattern, "-i", $palette, "-lavfi", "paletteuse=dither=bayer:bayer_scale=5", "-r", $frameRate, $output -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -ne 0) {
        Write-ColorOutput "Error: No se pudo crear el GIF" "Red"
        exit 1
    }
} catch {
    Write-ColorOutput "Error al ejecutar FFmpeg: $_" "Red"
    exit 1
}

if (-not (Test-Path $output)) {
    Write-ColorOutput "Error: No se pudo crear el GIF" "Red"
    exit 1
}

# Mostrar información del archivo generado
$fileSize = (Get-Item $output).Length
$fileSizeMB = [math]::Round($fileSize / 1MB, 2)
$fileSizeKB = [math]::Round($fileSize / 1KB, 2)

Write-Host ""
Write-ColorOutput "✓ GIF creado exitosamente!" "Green"
Write-Host ""
Write-Host "Archivo: $output"
if ($fileSizeMB -ge 1) {
    Write-Host "Tamaño: $fileSizeMB MB"
} else {
    Write-Host "Tamaño: $fileSizeKB KB"
}
Write-Host ""

# Limpiar archivo temporal
Remove-Item $palette -ErrorAction SilentlyContinue
Write-ColorOutput "✓ Archivos temporales eliminados" "Green"
Write-Host ""
Write-ColorOutput "¡Proceso completado! Tu GIF está listo en: $output" "Green"
