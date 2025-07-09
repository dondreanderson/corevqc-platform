// fix-jsx.js - Run this to fix malformed JSX
const fs = require('fs');
const path = require('path');

function fixJSXTags(content) {
  // Fix malformed self-closing tags
  content = content.replace(/\/\s+\/\s+\/>/g, ' />');
  
  // Fix missing closing tags for common elements
  content = content.replace(/<p([^>]*)>([^<]*)<\/div>/g, '<p$1>$2</p>');
  content = content.replace(/<span([^>]*)>([^<]*)<\/div>/g, '<span$1>$2</span>');
  
  // Fix function parameter syntax
  content = content.replace(/\)\s*=&gt;\s*{/g, ') => {');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  
  return content;
}

function fixFilesInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixFilesInDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = fixJSXTags(content);
        
        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent);
          console.log(`Fixed: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error fixing ${filePath}:`, error.message);
      }
    }
  });
}

// Fix all TypeScript/TSX files in src directory
fixFilesInDirectory('./src');
console.log('✅ JSX fix complete!');
