const fs = require('fs');
const path = require('path');

class JSXFixer {
    constructor() {
        this.fixes = [];
        this.errors = [];
    }

    fixJSXContent(content, filePath) {
        this.fixes = [];
        this.errors = [];

        let fixedContent = content;

        try {
            // 1. Add React import if missing
            fixedContent = this.addReactImport(fixedContent);

            // 2. Convert HTML document structure to React components
            fixedContent = this.convertHTMLStructure(fixedContent);

            // 3. Replace class with className
            fixedContent = this.replaceClassWithClassName(fixedContent);

            // 4. Replace HTML comments with JSX comments
            fixedContent = this.replaceHTMLComments(fixedContent);

            // 5. Fix self-closing tags
            fixedContent = this.fixSelfClosingTags(fixedContent);

            // 6. Fix invalid JSX attributes
            fixedContent = this.fixInvalidAttributes(fixedContent);

            // 7. Fix mismatched closing tags
            fixedContent = this.fixMismatchedTags(fixedContent);

            // 8. Wrap multiple JSX elements in fragments
            fixedContent = this.wrapInFragments(fixedContent);

            // 9. Fix common HTML to JSX attribute conversions
            fixedContent = this.fixHTMLToJSXAttributes(fixedContent);

            // 10. Fix boolean attributes
            fixedContent = this.fixBooleanAttributes(fixedContent);

            // 11. Fix style attributes
            fixedContent = this.fixStyleAttributes(fixedContent);

            // 12. Remove or fix invalid JSX elements
            fixedContent = this.fixInvalidJSXElements(fixedContent);

        } catch (error) {
            this.errors.push(`Error processing ${filePath}: ${error.message}`);
        }

        return fixedContent;
    }

    addReactImport(content) {
        const reactImportRegex = /import\s+.*React.*from\s+['"]react['"]/;
        const hasReactImport = reactImportRegex.test(content);

        if (!hasReactImport && (content.includes('<') || content.includes('JSX'))) {
            const importStatement = "import React from 'react';\n";
            content = importStatement + content;
            this.fixes.push('Added React import');
        }

        return content;
    }

    convertHTMLStructure(content) {
        // Remove DOCTYPE declarations
        if (content.includes('<!DOCTYPE')) {
            content = content.replace(/<!DOCTYPE[^>]*>/gi, '');
            this.fixes.push('Removed DOCTYPE declaration');
        }

        // Convert html, head, body tags to div or remove them
        const htmlStructureTags = ['html', 'head', 'body'];
        htmlStructureTags.forEach(tag => {
            const openTagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
            const closeTagRegex = new RegExp(`</${tag}>`, 'gi');

            if (openTagRegex.test(content)) {
                content = content.replace(openTagRegex, '<div>');
                content = content.replace(closeTagRegex, '</div>');
                this.fixes.push(`Converted ${tag} tags to div`);
            }
        });

        // Remove meta, link, title tags that are not valid in JSX body
        const invalidTags = ['meta', 'link', 'title'];
        invalidTags.forEach(tag => {
            const tagRegex = new RegExp(`<${tag}[^>]*/?>`,'gi');
            if (tagRegex.test(content)) {
                content = content.replace(tagRegex, '');
                this.fixes.push(`Removed ${tag} tags`);
            }
        });

        return content;
    }

    replaceClassWithClassName(content) {
        // Replace class= with className= (but not in comments or strings)
        const classRegex = /\bclass=/g;
        const matches = content.match(classRegex);

        if (matches) {
            content = content.replace(classRegex, 'className=');
            this.fixes.push(`Replaced ${matches.length} class attributes with className`);
        }

        return content;
    }

    replaceHTMLComments(content) {
        // Replace HTML comments with JSX comments
        const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
        const matches = content.match(htmlCommentRegex);

        if (matches) {
            content = content.replace(htmlCommentRegex, '{/*$1*/}');
            this.fixes.push(`Converted ${matches.length} HTML comments to JSX comments`);
        }

        return content;
    }

    fixSelfClosingTags(content) {
        const selfClosingTags = [
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];

        let fixCount = 0;
        selfClosingTags.forEach(tag => {
            // Fix tags that should be self-closing but aren't
            const nonSelfClosingRegex = new RegExp(`<${tag}([^>]*)>(?!\s*</${tag}>)`, 'gi');
            const matches = content.match(nonSelfClosingRegex);

            if (matches) {
                content = content.replace(nonSelfClosingRegex, `<${tag}$1 />`);
                fixCount += matches.length;
            }

            // Fix self-closing tags without space before /
            const noSpaceRegex = new RegExp(`<${tag}([^>]*[^\s])/>`,'gi');
            const noSpaceMatches = content.match(noSpaceRegex);

            if (noSpaceMatches) {
                content = content.replace(noSpaceRegex, `<${tag}$1 />`);
                fixCount += noSpaceMatches.length;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Fixed ${fixCount} self-closing tags`);
        }

        return content;
    }

    fixInvalidAttributes(content) {
        const attributeReplacements = {
            'for=': 'htmlFor=',
            'tabindex=': 'tabIndex=',
            'readonly=': 'readOnly=',
            'maxlength=': 'maxLength=',
            'cellpadding=': 'cellPadding=',
            'cellspacing=': 'cellSpacing=',
            'rowspan=': 'rowSpan=',
            'colspan=': 'colSpan=',
            'usemap=': 'useMap=',
            'frameborder=': 'frameBorder=',
            'contenteditable=': 'contentEditable=',
            'crossorigin=': 'crossOrigin=',
            'datetime=': 'dateTime=',
            'enctype=': 'encType=',
            'formaction=': 'formAction=',
            'formenctype=': 'formEncType=',
            'formmethod=': 'formMethod=',
            'formnovalidate=': 'formNoValidate=',
            'formtarget=': 'formTarget=',
            'hreflang=': 'hrefLang=',
            'marginheight=': 'marginHeight=',
            'marginwidth=': 'marginWidth=',
            'novalidate=': 'noValidate=',
            'radiogroup=': 'radioGroup=',
            'spellcheck=': 'spellCheck=',
            'srcdoc=': 'srcDoc=',
            'srclang=': 'srcLang=',
            'srcset=': 'srcSet=',
            'autofocus=': 'autoFocus=',
            'autoplay=': 'autoPlay=',
            'controls=': 'controls=',
            'defer=': 'defer=',
            'disabled=': 'disabled=',
            'hidden=': 'hidden=',
            'loop=': 'loop=',
            'multiple=': 'multiple=',
            'muted=': 'muted=',
            'open=': 'open=',
            'required=': 'required=',
            'reversed=': 'reversed=',
            'selected=': 'selected='
        };

        let fixCount = 0;
        Object.entries(attributeReplacements).forEach(([oldAttr, newAttr]) => {
            const regex = new RegExp(`\\b${oldAttr.replace('=', '')}=`, 'g');
            const matches = content.match(regex);

            if (matches) {
                content = content.replace(regex, newAttr);
                fixCount += matches.length;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Fixed ${fixCount} invalid JSX attributes`);
        }

        return content;
    }

    fixMismatchedTags(content) {
        // This is a simplified version - a full implementation would need a proper parser
        const commonMismatches = [
            { open: '<div>', close: '</span>' },
            { open: '<span>', close: '</div>' },
            { open: '<p>', close: '</div>' },
            { open: '<div>', close: '</p>' }
        ];

        let fixCount = 0;
        commonMismatches.forEach(({ open, close }) => {
            const openTag = open.match(/<(\w+)/)[1];
            const closeTag = close.match(/<\/(\w+)/)[1];

            if (content.includes(open) && content.includes(close)) {
                content = content.replace(close, `</${openTag}>`);
                fixCount++;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Fixed ${fixCount} mismatched closing tags`);
        }

        return content;
    }

    wrapInFragments(content) {
        // Check if there are multiple root elements
        const lines = content.split('\n');
        const jsxStartRegex = /^\s*</;
        const jsxEndRegex = />\s*$/;

        let rootElements = 0;
        let inJSX = false;
        let depth = 0;

        for (let line of lines) {
            if (jsxStartRegex.test(line)) {
                if (depth === 0) {
                    rootElements++;
                }
                inJSX = true;
                depth++;
            }
            if (jsxEndRegex.test(line) && inJSX) {
                depth--;
                if (depth === 0) {
                    inJSX = false;
                }
            }
        }

        if (rootElements > 1) {
            // Find the return statement and wrap JSX in fragments
            const returnRegex = /(return\s*\(?)([\s\S]*?)(\)?;?\s*}?\s*$)/;
            const match = content.match(returnRegex);

            if (match) {
                const beforeReturn = match[1] || 'return (';
                const jsxContent = match[2].trim();
                const afterReturn = match[3] || ');';

                content = content.replace(returnRegex, 
                    `${beforeReturn}\n    <>\n${jsxContent}\n    </>\n${afterReturn}`
                );
                this.fixes.push('Wrapped multiple JSX elements in React Fragment');
            }
        }

        return content;
    }

    fixHTMLToJSXAttributes(content) {
        // Fix data-* and aria-* attributes (these are valid in JSX)
        // Fix style attributes to use objects
        let fixCount = 0;

        // Fix onclick, onchange, etc. to onClick, onChange, etc.
        const eventHandlers = [
            'onclick', 'onchange', 'onsubmit', 'onload', 'onfocus', 'onblur',
            'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress'
        ];

        eventHandlers.forEach(handler => {
            const regex = new RegExp(`\\b${handler}=`, 'gi');
            const matches = content.match(regex);

            if (matches) {
                const camelCase = handler.charAt(0).toLowerCase() + 
                    handler.slice(1).replace(/([a-z])([A-Z])/g, '$1$2');
                const properCase = 'on' + handler.slice(2).charAt(0).toUpperCase() + 
                    handler.slice(3);

                content = content.replace(regex, `${properCase}=`);
                fixCount += matches.length;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Fixed ${fixCount} event handler attributes`);
        }

        return content;
    }

    fixBooleanAttributes(content) {
        const booleanAttrs = [
            'checked', 'selected', 'disabled', 'readonly', 'multiple', 
            'autofocus', 'autoplay', 'controls', 'defer', 'hidden', 
            'loop', 'muted', 'open', 'required', 'reversed'
        ];

        let fixCount = 0;
        booleanAttrs.forEach(attr => {
            // Fix boolean attributes that have empty values
            const emptyValueRegex = new RegExp(`${attr}=""`, 'gi');
            const matches = content.match(emptyValueRegex);

            if (matches) {
                content = content.replace(emptyValueRegex, attr);
                fixCount += matches.length;
            }

            // Fix boolean attributes with the same value as name
            const sameValueRegex = new RegExp(`${attr}="${attr}"`, 'gi');
            const sameValueMatches = content.match(sameValueRegex);

            if (sameValueMatches) {
                content = content.replace(sameValueRegex, attr);
                fixCount += sameValueMatches.length;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Fixed ${fixCount} boolean attributes`);
        }

        return content;
    }

    fixStyleAttributes(content) {
        // Convert inline style strings to objects (basic implementation)
        const styleRegex = /style="([^"]+)"/g;
        let match;
        let fixCount = 0;

        while ((match = styleRegex.exec(content)) !== null) {
            const styleString = match[1];
            const styleObject = this.convertStyleStringToObject(styleString);

            if (styleObject) {
                content = content.replace(match[0], `style={${styleObject}}`);
                fixCount++;
            }
        }

        if (fixCount > 0) {
            this.fixes.push(`Converted ${fixCount} style attributes to JSX format`);
        }

        return content;
    }

    convertStyleStringToObject(styleString) {
        try {
            const styles = styleString.split(';').filter(s => s.trim());
            const styleProps = styles.map(style => {
                const [property, value] = style.split(':').map(s => s.trim());
                if (property && value) {
                    // Convert kebab-case to camelCase
                    const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    return `${camelProperty}: "${value}"`;
                }
                return null;
            }).filter(Boolean);

            return `{${styleProps.join(', ')}}`;
        } catch (error) {
            return null;
        }
    }

    fixInvalidJSXElements(content) {
        // Remove or fix elements that are not valid in JSX
        const invalidElements = ['script', 'style', 'noscript'];
        let fixCount = 0;

        invalidElements.forEach(element => {
            const elementRegex = new RegExp(`<${element}[^>]*>[\s\S]*?</${element}>`, 'gi');
            const matches = content.match(elementRegex);

            if (matches) {
                content = content.replace(elementRegex, `{/* ${element} content removed for JSX compatibility */}`);
                fixCount += matches.length;
            }
        });

        if (fixCount > 0) {
            this.fixes.push(`Removed ${fixCount} invalid JSX elements`);
        }

        return content;
    }

    processFile(filePath) {
        try {
            console.log(`\n🔧 Processing: ${filePath}`);

            if (!fs.existsSync(filePath)) {
                console.error(`❌ File not found: ${filePath}`);
                return false;
            }

            const originalContent = fs.readFileSync(filePath, 'utf8');
            const fixedContent = this.fixJSXContent(originalContent, filePath);

            // Only write if changes were made
            if (originalContent !== fixedContent) {
                // Create backup
                const backupPath = filePath + '.backup';
                fs.writeFileSync(backupPath, originalContent);

                // Write fixed content
                fs.writeFileSync(filePath, fixedContent);

                console.log(`✅ Fixed ${filePath}`);
                console.log(`📋 Fixes applied:`);
                this.fixes.forEach(fix => console.log(`   • ${fix}`));

                if (this.errors.length > 0) {
                    console.log(`⚠️  Warnings:`);
                    this.errors.forEach(error => console.log(`   • ${error}`));
                }

                console.log(`💾 Backup saved as: ${backupPath}`);
                return true;
            } else {
                console.log(`✨ No fixes needed for ${filePath}`);
                return false;
            }

        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
            return false;
        }
    }

    processDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
        console.log(`\n📁 Processing directory: ${dirPath}`);

        if (!fs.existsSync(dirPath)) {
            console.error(`❌ Directory not found: ${dirPath}`);
            return;
        }

        const files = this.getAllFiles(dirPath, extensions);
        console.log(`📄 Found ${files.length} files to process`);

        let processedCount = 0;
        let fixedCount = 0;

        files.forEach(file => {
            processedCount++;
            if (this.processFile(file)) {
                fixedCount++;
            }
        });

        console.log(`\n📊 Summary:`);
        console.log(`   • Files processed: ${processedCount}`);
        console.log(`   • Files fixed: ${fixedCount}`);
        console.log(`   • Files unchanged: ${processedCount - fixedCount}`);
    }

    getAllFiles(dirPath, extensions) {
        let files = [];

        const items = fs.readdirSync(dirPath);

        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip node_modules and other common directories
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    files = files.concat(this.getAllFiles(fullPath, extensions));
                }
            } else if (stat.isFile()) {
                const ext = path.extname(fullPath);
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        });

        return files;
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
🔧 JSX Fixer - Automatic JSX Syntax Error Correction

Usage:
  node jsx-fixer.js <file-path>              # Fix a single file
  node jsx-fixer.js <directory-path> --dir   # Fix all files in directory
  node jsx-fixer.js --help                   # Show this help

Examples:
  node jsx-fixer.js ./src/components/MyComponent.jsx
  node jsx-fixer.js ./src --dir
  node jsx-fixer.js ./src/components --dir

Features:
  ✅ Convert HTML document structure to React components
  ✅ Replace class attributes with className
  ✅ Replace HTML comments with JSX comments
  ✅ Add proper React imports
  ✅ Fix self-closing tags
  ✅ Wrap multiple JSX elements in fragments
  ✅ Handle mismatched closing tags
  ✅ Fix invalid JSX attributes
  ✅ Convert event handlers to proper case
  ✅ Fix boolean attributes
  ✅ Convert style attributes to JSX format
  ✅ Remove invalid JSX elements
  ✅ Create automatic backups
        `);
        return;
    }

    const fixer = new JSXFixer();
    const targetPath = args[0];
    const isDirectory = args.includes('--dir');

    if (isDirectory) {
        fixer.processDirectory(targetPath);
    } else {
        fixer.processFile(targetPath);
    }
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSXFixer;
}

// Run if called directly
if (require.main === module) {
    main();
}
