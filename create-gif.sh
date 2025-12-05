#!/bin/bash

# Script para crear un GIF animado de la invitación usando FFmpeg
# Uso: ./create-gif.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: FFmpeg no está instalado.${NC}"
    echo ""
    echo "Por favor instala FFmpeg primero:"
    echo ""
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Fedora:  sudo dnf install ffmpeg"
    echo ""
    exit 1
fi

# Verificar si existe la carpeta frames
if [ ! -d "frames" ]; then
    echo -e "${RED}Error: La carpeta 'frames' no existe.${NC}"
    echo ""
    echo "Crea una carpeta llamada 'frames' y añade tus capturas de pantalla:"
    echo "  - frame001.png"
    echo "  - frame002.png"
    echo "  - frame003.png"
    echo "  - etc."
    echo ""
    exit 1
fi

# Contar archivos en la carpeta frames
frame_count=$(find frames -name 'frame*.png' -type f 2>/dev/null | wc -l)
if [ "$frame_count" -lt 2 ]; then
    echo -e "${RED}Error: Se necesitan al menos 2 frames en la carpeta 'frames'.${NC}"
    echo ""
    echo "Archivos encontrados: $frame_count"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ FFmpeg está instalado${NC}"
echo -e "${GREEN}✓ Encontrados $frame_count frames${NC}"
echo ""

# Configuración
FRAMERATE=15
INPUT_PATTERN="frames/frame%03d.png"
PALETTE="palette.png"
OUTPUT="out.gif"

echo "Configuración:"
echo "  - Entrada: $INPUT_PATTERN"
echo "  - Frame rate: $FRAMERATE fps"
echo "  - Salida: $OUTPUT"
echo ""

# Paso 1: Generar paleta de colores
echo -e "${YELLOW}Paso 1/2: Generando paleta de colores optimizada...${NC}"
ffmpeg -y -i "$INPUT_PATTERN" -vf "palettegen=stats_mode=diff" "$PALETTE" 2>&1 | grep -v "^frame=" | tail -5

if [ ! -f "$PALETTE" ]; then
    echo -e "${RED}Error: No se pudo generar la paleta${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Paleta generada: $PALETTE${NC}"
echo ""

# Paso 2: Crear el GIF
echo -e "${YELLOW}Paso 2/2: Creando GIF animado...${NC}"
ffmpeg -y -i "$INPUT_PATTERN" -i "$PALETTE" -lavfi "paletteuse=dither=bayer:bayer_scale=5" -r "$FRAMERATE" "$OUTPUT" 2>&1 | grep -v "^frame=" | tail -5

if [ ! -f "$OUTPUT" ]; then
    echo -e "${RED}Error: No se pudo crear el GIF${NC}"
    exit 1
fi

# Mostrar información del archivo generado
file_size=$(du -h "$OUTPUT" | cut -f1)
echo ""
echo -e "${GREEN}✓ GIF creado exitosamente!${NC}"
echo ""
echo "Archivo: $OUTPUT"
echo "Tamaño: $file_size"
echo ""

# Limpiar archivo temporal
rm -f "$PALETTE"
echo -e "${GREEN}✓ Archivos temporales eliminados${NC}"
echo ""
echo -e "${GREEN}¡Proceso completado! Tu GIF está listo en: $OUTPUT${NC}"
