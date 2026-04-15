const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const indexPath = path.join(projectRoot, 'index.html');

// Pastas para verificar a existência de imagens webp
const scanDirectories = [
    projectRoot,
    path.join(projectRoot, 'imagens')
];

function getAllWebpFiles() {
    let webpFiles = [];

    scanDirectories.forEach(dir => {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.webp') {
                // Se estiver no root, o caminho é só o nome do arquivo
                // Se estiver na subpasta, o caminho inclui a subpasta
                let relativePath;
                if (dir === projectRoot) {
                    relativePath = file;
                } else {
                    const relativeDir = path.relative(projectRoot, dir);
                    relativePath = path.join(relativeDir, file).replace(/\\/g, '/'); // Formato de URL
                }
                
                webpFiles.push(`            '${relativePath}'`);
            }
        });
    });

    return webpFiles;
}

function updateIndexHtml() {
    console.log('Procurando imagens .webp...');
    const webpFiles = getAllWebpFiles();
    
    if (webpFiles.length === 0) {
        console.log('Nenhuma imagem .webp encontrada.');
        return;
    }

    const filesString = webpFiles.join(',\n');
    console.log(`Encontradas ${webpFiles.length} imagens.`);

    try {
        let htmlContent = fs.readFileSync(indexPath, 'utf8');

        // Padrões de início e fim da lista de arquivos
        const startMarker = '// <!-- IMAGES_START -->';
        const endMarker = '// <!-- IMAGES_END -->';

        const startIndex = htmlContent.indexOf(startMarker);
        const endIndex = htmlContent.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.error('Erro: Não foi possível encontrar os marcadores no index.html.');
            return;
        }

        // Substitui o conteúdo entre os marcadores
        const beforeContent = htmlContent.substring(0, startIndex + startMarker.length);
        const afterContent = htmlContent.substring(endIndex);

        const newHtmlContent = `${beforeContent}\n${filesString}\n            ${afterContent}`;

        fs.writeFileSync(indexPath, newHtmlContent, 'utf8');
        console.log('Sucesso! index.html atualizado com as imagens mais recentes.');
    } catch (err) {
        console.error('Erro ao atualizar index.html:', err);
    }
}

updateIndexHtml();