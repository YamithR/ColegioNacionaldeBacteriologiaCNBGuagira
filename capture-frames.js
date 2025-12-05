/**
 * Script para capturar frames automáticamente de la página web
 * Requiere: npm install puppeteer
 * Uso: node capture-frames.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
    url: `file://${path.resolve(__dirname, 'index.html')}`,
    outputDir: 'frames',
    duration: 10, // Duración total en segundos
    fps: 15, // Frames por segundo
    viewport: {
        width: 390,
        height: 844,
        deviceScaleFactor: 2
    }
};

async function captureFrames() {
    console.log('🎬 Iniciando captura de frames...\n');
    
    // Crear carpeta de salida si no existe
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir);
        console.log(`✓ Carpeta '${CONFIG.outputDir}' creada`);
    } else {
        // Limpiar frames existentes
        const existingFrames = fs.readdirSync(CONFIG.outputDir)
            .filter(f => f.startsWith('frame') && f.endsWith('.png'));
        existingFrames.forEach(f => fs.unlinkSync(path.join(CONFIG.outputDir, f)));
        console.log(`✓ Carpeta '${CONFIG.outputDir}' limpiada`);
    }
    
    // Calcular número total de frames
    const totalFrames = CONFIG.duration * CONFIG.fps;
    const frameInterval = 1000 / CONFIG.fps; // Milisegundos entre frames
    
    console.log(`\nConfiguración:`);
    console.log(`  - URL: ${CONFIG.url}`);
    console.log(`  - Resolución: ${CONFIG.viewport.width}x${CONFIG.viewport.height}`);
    console.log(`  - Duración: ${CONFIG.duration}s`);
    console.log(`  - FPS: ${CONFIG.fps}`);
    console.log(`  - Total frames: ${totalFrames}`);
    console.log(`\n📸 Capturando frames...\n`);
    
    // Iniciar navegador
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Configurar viewport
        await page.setViewport(CONFIG.viewport);
        
        // Navegar a la página
        await page.goto(CONFIG.url, {
            waitUntil: 'networkidle0'
        });
        
        // Esperar un momento para que las animaciones comiencen
        await page.waitForTimeout(1000);
        
        // Capturar frames
        for (let i = 0; i < totalFrames; i++) {
            const frameNumber = String(i + 1).padStart(3, '0');
            const framePath = path.join(CONFIG.outputDir, `frame${frameNumber}.png`);
            
            await page.screenshot({
                path: framePath,
                type: 'png'
            });
            
            // Mostrar progreso
            const progress = ((i + 1) / totalFrames * 100).toFixed(1);
            process.stdout.write(`\r  Progreso: ${progress}% (${i + 1}/${totalFrames} frames)`);
            
            // Esperar antes del siguiente frame
            if (i < totalFrames - 1) {
                await page.waitForTimeout(frameInterval);
            }
        }
        
        console.log('\n\n✓ Captura completada!\n');
        console.log(`Frames guardados en: ${path.resolve(CONFIG.outputDir)}`);
        console.log(`\nAhora puedes crear el GIF ejecutando:`);
        console.log(`  - Windows: .\\create-gif.ps1`);
        console.log(`  - Unix:    ./create-gif.sh`);
        console.log(`  - Node.js: npm run gif`);
        
    } catch (error) {
        console.error('\n❌ Error durante la captura:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

// Ejecutar
if (require.main === module) {
    captureFrames()
        .then(() => {
            console.log('\n✓ Proceso completado exitosamente');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { captureFrames };
