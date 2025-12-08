Exportar la invitación a GIF

Este repositorio incluye un script que captura la invitación (`index.html`) como una secuencia de PNGs usando Puppeteer, y luego puedes convertir esas imágenes a GIF usando `ffmpeg`.

Requisitos:
- Node.js (>=14)
- `npm` o `pnpm`
- `ffmpeg` en PATH

Pasos rápidos:

1) Instala dependencias (en la raíz del proyecto):

```bash
npm init -y
npm install puppeteer minimist
```

2) Ejecuta el script para capturar frames. Cambia la ruta `file:///...` por la ruta absoluta a tu `index.html` (Windows: usa `file:///C:/Users/.../index.html`). Por ejemplo:

```bash
node scripts/capture_gif.js --url="file:///C:/Users/yamit/Documents/GitHub/ColegioNacionaldeBacteriologiaCNB/index.html" --frames=60 --fps=15 --outdir=frames
```

Esto genera `frames/frame000.png` ... `frames/frame059.png`.

3) Genera la paleta (mejor calidad):

```bash
ffmpeg -y -i frames/frame%03d.png -vf palettegen palette.png
```

4) Crea el GIF usando la paleta:

```bash
ffmpeg -y -i frames/frame%03d.png -i palette.png -lavfi paletteuse -r 15 out.gif
```

Notas y recomendaciones:
- Ajusta `--frames` y `--fps` según la duración y tamaño deseado. Ejemplo: 45 frames a 15 fps = 3s.
- Si quieres un GIF más pequeño, escala las imágenes antes del `palettegen` y `paletteuse` usando `-vf "scale=480:-1:flags=lanczos,palettegen"` y similar en la generación.
- En Windows PowerShell, recuerda escapar rutas o usar comillas.

Si quieres, puedo:
- Añadir un comando que ejecute ffmpeg automáticamente desde Node (si `ffmpeg` está instalado).
- Generar una versión corta (3s) y optimizada para mensajería.
