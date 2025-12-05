/**
 * Script de Node.js para crear un GIF usando FFmpeg
 * Requiere: FFmpeg instalado en el sistema
 * Uso: node create-gif-node.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Configuración
const CONFIG = {
    framesDir: 'frames',
    inputPattern: 'frames/frame%03d.png',
    palette: 'palette.png',
    output: 'out.gif',
    framerate: 15
};

async function checkFFmpeg() {
    try {
        await execPromise('ffmpeg -version');
        return { installed: true, error: null };
    } catch (error) {
        return { installed: false, error: error.message };
    }
}

async function checkFrames() {
    if (!fs.existsSync(CONFIG.framesDir)) {
        throw new Error(`La carpeta '${CONFIG.framesDir}' no existe`);
    }
    
    const frames = fs.readdirSync(CONFIG.framesDir)
        .filter(f => f.startsWith('frame') && f.endsWith('.png'));
    
    if (frames.length < 2) {
        throw new Error(`Se necesitan al menos 2 frames. Encontrados: ${frames.length}`);
    }
    
    return frames.length;
}

async function generatePalette() {
    console.log('🎨 Generando paleta de colores optimizada...');
    
    const command = `ffmpeg -y -i ${CONFIG.inputPattern} -vf "palettegen=stats_mode=diff" ${CONFIG.palette}`;
    
    try {
        await execPromise(command);
        
        if (!fs.existsSync(CONFIG.palette)) {
            throw new Error('No se pudo generar la paleta');
        }
        
        console.log('✓ Paleta generada exitosamente\n');
    } catch (error) {
        throw new Error(`Error al generar paleta: ${error.message}`);
    }
}

async function createGIF() {
    console.log('🎬 Creando GIF animado...');
    
    const command = `ffmpeg -y -i ${CONFIG.inputPattern} -i ${CONFIG.palette} -lavfi "paletteuse=dither=bayer:bayer_scale=5" -r ${CONFIG.framerate} ${CONFIG.output}`;
    
    try {
        await execPromise(command);
        
        if (!fs.existsSync(CONFIG.output)) {
            throw new Error('No se pudo crear el GIF');
        }
        
        const stats = fs.statSync(CONFIG.output);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        
        console.log('✓ GIF creado exitosamente\n');
        console.log('Archivo:', CONFIG.output);
        console.log('Tamaño:', fileSizeMB >= 1 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`);
        
    } catch (error) {
        throw new Error(`Error al crear GIF: ${error.message}`);
    }
}

async function cleanup() {
    try {
        if (fs.existsSync(CONFIG.palette)) {
            fs.unlinkSync(CONFIG.palette);
            console.log('\n✓ Archivos temporales eliminados');
        }
    } catch (error) {
        console.warn('Advertencia: No se pudo eliminar archivos temporales');
    }
}

async function main() {
    console.log('🎬 Script de creación de GIF\n');
    
    try {
        // Verificar FFmpeg
        console.log('Verificando requisitos...');
        const ffmpegCheck = await checkFFmpeg();
        
        if (!ffmpegCheck.installed) {
            console.error('\n❌ Error: FFmpeg no está instalado');
            if (ffmpegCheck.error) {
                console.error(`Detalles: ${ffmpegCheck.error}`);
            }
            console.log('\nPor favor instala FFmpeg primero:');
            console.log('  - Windows: winget install FFmpeg');
            console.log('  - macOS:   brew install ffmpeg');
            console.log('  - Linux:   sudo apt install ffmpeg');
            process.exit(1);
        }
        
        console.log('✓ FFmpeg está instalado');
        
        // Verificar frames
        const frameCount = await checkFrames();
        console.log(`✓ Encontrados ${frameCount} frames\n`);
        
        // Configuración
        console.log('Configuración:');
        console.log(`  - Entrada: ${CONFIG.inputPattern}`);
        console.log(`  - Frame rate: ${CONFIG.framerate} fps`);
        console.log(`  - Salida: ${CONFIG.output}\n`);
        
        // Generar paleta
        await generatePalette();
        
        // Crear GIF
        await createGIF();
        
        // Limpiar
        await cleanup();
        
        console.log('\n✓ ¡Proceso completado! Tu GIF está listo en:', CONFIG.output);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        
        // Limpiar en caso de error
        await cleanup();
        
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    main();
}

module.exports = { createGIF, generatePalette };
