# Guía Rápida - Exportar como GIF

## TL;DR - Solución al Error de FFmpeg

Si recibiste el error: `ffmpeg: The term 'ffmpeg' is not recognized...`, sigue estos pasos:

## Paso 1: Instalar FFmpeg

### Windows (Elige una opción)

**Opción A - WinGet (Recomendado para Windows 10/11)**
```powershell
winget install FFmpeg
```

**Opción B - Chocolatey**
```powershell
choco install ffmpeg
```

**Opción C - Manual**
1. Descarga desde: https://ffmpeg.org/download.html
2. Extrae el ZIP
3. Añade la carpeta `bin` al PATH de Windows

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Fedora/RHEL
sudo dnf install ffmpeg
```

## Paso 2: Verificar Instalación

Cierra y vuelve a abrir tu terminal/PowerShell, luego ejecuta:
```bash
ffmpeg -version
```

Si ves la información de versión, ¡estás listo!

## Paso 3: Preparar Frames

Necesitas capturas de pantalla de tu página web:

### Opción A - Captura Manual
1. Crea una carpeta llamada `frames`
2. Abre `index.html` en tu navegador
3. Toma capturas de pantalla secuenciales
4. Guárdalas como: `frame001.png`, `frame002.png`, `frame003.png`, etc.

### Opción B - Captura Automática (Recomendado)
```bash
# Instalar dependencias
npm install

# Capturar frames automáticamente
npm run capture
```

Esto creará automáticamente 150 frames (10 segundos a 15 fps).

## Paso 4: Crear el GIF

### Windows
```powershell
.\create-gif.ps1
```

### macOS/Linux
```bash
./create-gif.sh
```

### Multiplataforma (Node.js)
```bash
npm run gif
```

## Resultado

El script creará un archivo `out.gif` con tu invitación animada.

## Personalización

Edita los scripts si quieres cambiar:
- Frame rate (velocidad): Cambia `-r 15` a otro valor
- Tamaño: Añade `-vf scale=iw*0.5:ih*0.5` para reducir a 50%
- Calidad: Ajusta `bayer_scale` (valores más bajos = mejor calidad)

## Solución de Problemas

### "ffmpeg no se reconoce..."
- ✅ Instala FFmpeg (ver Paso 1)
- ✅ Cierra y reabre tu terminal
- ✅ Verifica con `ffmpeg -version`

### "No se encuentran los archivos frames/..."
- ✅ Crea la carpeta `frames`
- ✅ Asegúrate de tener al menos 2 imágenes PNG
- ✅ Nombra los archivos secuencialmente: `frame001.png`, `frame002.png`, etc.

### El GIF es muy grande
```bash
# Reduce el tamaño con escala al 50%
ffmpeg -y -i frames/frame%03d.png -vf "scale=iw*0.5:ih*0.5,palettegen" palette.png
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi "scale=iw*0.5:ih*0.5,paletteuse" -r 15 out.gif
```

## Referencia Rápida de Comandos

```bash
# Comandos originales que dieron error (ahora funcionarán después de instalar FFmpeg)
ffmpeg -y -i frames/frame%03d.png -vf palettegen palette.png
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi paletteuse -r 15 out.gif

# Comando optimizado (mejor calidad)
ffmpeg -y -i frames/frame%03d.png -vf "palettegen=stats_mode=diff" palette.png
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi "paletteuse=dither=bayer:bayer_scale=5" -r 15 out.gif
```

## ¿Necesitas Más Ayuda?

Consulta el archivo `README.md` para documentación completa con:
- Instrucciones detalladas
- Opciones avanzadas
- Ejemplos de optimización
- Troubleshooting completo
