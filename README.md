# Bingo Navideño CNB - Invitación Digital

Este proyecto contiene una invitación digital interactiva para el Bingo Navideño del Colegio Nacional de Bacteriología.

## Visualización

Simplemente abre `index.html` en tu navegador para ver la invitación.

## Exportar como GIF

Para exportar la página web como un GIF animado, necesitarás instalar FFmpeg y seguir estos pasos:

### Paso 1: Instalar FFmpeg

#### Windows
1. **Opción 1 - Usando WinGet (Windows 10/11):**
   ```powershell
   winget install FFmpeg
   ```

2. **Opción 2 - Descarga Manual:**
   - Visita https://ffmpeg.org/download.html
   - Descarga la versión para Windows
   - Extrae el archivo ZIP
   - Añade la carpeta `bin` al PATH de Windows:
     - Abre "Variables de entorno"
     - Edita la variable PATH
     - Añade la ruta a la carpeta `bin` de FFmpeg

3. **Opción 3 - Usando Chocolatey:**
   ```powershell
   choco install ffmpeg
   ```

#### macOS
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Linux (Fedora/RHEL)
```bash
sudo dnf install ffmpeg
```

### Paso 2: Verificar la Instalación

Abre una nueva terminal/PowerShell y ejecuta:
```bash
ffmpeg -version
```

Si ves la información de versión, FFmpeg está correctamente instalado.

### Paso 3: Capturar Frames

Necesitas capturar frames de la página web. Puedes usar herramientas como:

1. **Captura manual con screenshots:**
   - Abre la página en tu navegador
   - Toma capturas de pantalla en intervalos regulares
   - Guárdalas en una carpeta `frames/` con nombres secuenciales: `frame001.png`, `frame002.png`, etc.

2. **Usando herramientas automatizadas:**
   - Puppeteer (Node.js)
   - Playwright (Node.js, Python)
   - Selenium WebDriver

### Paso 4: Crear el GIF

Una vez que tengas los frames, usa uno de los scripts incluidos:

#### Windows - PowerShell
```powershell
.\create-gif.ps1
```

#### Unix (macOS/Linux) - Bash
```bash
chmod +x create-gif.sh
./create-gif.sh
```

#### Manualmente
```bash
# Generar paleta de colores optimizada
ffmpeg -y -i frames/frame%03d.png -vf palettegen palette.png

# Crear el GIF usando la paleta
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi paletteuse -r 15 out.gif
```

### Parámetros Opcionales

Puedes ajustar la calidad y tamaño del GIF:

```bash
# Reducir tamaño (escalar a 50%)
ffmpeg -y -i frames/frame%03d.png -vf "scale=iw*0.5:ih*0.5,palettegen" palette.png
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi "scale=iw*0.5:ih*0.5,paletteuse" -r 15 out.gif

# Cambiar frame rate (más rápido = más frames por segundo)
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi paletteuse -r 30 out.gif

# Optimizar tamaño del archivo
ffmpeg -y -i frames/frame%03d.png -vf "palettegen=stats_mode=diff" palette.png
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi "paletteuse=dither=bayer:bayer_scale=5" -r 15 out.gif
```

## Captura Automática de Frames (Opcional)

Si deseas automatizar la captura de frames, puedes usar el script de Node.js incluido:

### Requisitos
```bash
npm install
```

### Ejecutar
```bash
node capture-frames.js
```

Esto capturará automáticamente frames de la página web y los guardará en la carpeta `frames/`.

## Estructura del Proyecto

```
.
├── index.html              # Página principal de la invitación
├── CNBlogo.jpg            # Logo del CNB
├── bootstrap.min.css      # Estilos de Bootstrap
├── README.md              # Este archivo
├── create-gif.sh          # Script para crear GIF (Unix)
├── create-gif.ps1         # Script para crear GIF (Windows)
├── package.json           # Dependencias de Node.js (opcional)
└── capture-frames.js      # Script para capturar frames (opcional)
```

## Solución de Problemas

### "ffmpeg no se reconoce como un comando"
- Asegúrate de haber instalado FFmpeg correctamente
- Verifica que FFmpeg esté en tu PATH
- Cierra y vuelve a abrir tu terminal/PowerShell después de instalar

### "No se encuentran los archivos frames/frame%03d.png"
- Asegúrate de tener una carpeta `frames/` con imágenes
- Los archivos deben estar nombrados secuencialmente: `frame001.png`, `frame002.png`, etc.
- Necesitas al menos 2 frames para crear un GIF

### El GIF es muy grande
- Reduce el tamaño de las imágenes con el parámetro `scale`
- Reduce el frame rate (menos frames por segundo)
- Usa opciones de compresión más agresivas

### El GIF se ve pixelado
- Aumenta la resolución de los frames originales
- Usa una paleta de colores de mayor calidad
- Experimenta con diferentes opciones de dithering

## Recursos Adicionales

- [Documentación oficial de FFmpeg](https://ffmpeg.org/documentation.html)
- [Guía de creación de GIFs con FFmpeg](https://ffmpeg.org/ffmpeg-filters.html#palettegen)
- [Optimización de GIFs](https://cassidy.codes/blog/2017/04/25/ffmpeg-frames-to-gif-optimization/)

## Contacto

Para más información sobre el evento, visita: https://cnbcolombia.org/
