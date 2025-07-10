#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class JSXDiagnostic {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    // Check for missing React import
    checkReactImport(content, filename) {
        const lines = content.split('\n');
        const hasReactImport = /^import\s+.*React.*from\s+['"]react['"]/.test(content) ||
                              /^import\s+React/.test(content) ||
                              /const\s+React\s*=\s*require\(['"]react['"]\)/.test(content);

        const hasJSX = /<[A-Z]/.test(content) || /<\w+/.test(content);

        if (hasJSX && !hasReactImport) {
            this.errors.push({
                file: filename,
                line: 1,
                type: 'Missing React Import',
                message: 'JSX detected but React is not imported',
                suggestion: 'Add: import React from \'react\';'
            });
        }
    }

    // Check for HTML comments in JSX
    checkHTMLComments(content, filename) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('<!--') || line.includes('-->')) {
                this.errors.push({
                    file: filename,
                    line: index + 1,
                    type: 'HTML Comment in JSX',
                    message: 'HTML comments are not allowed in JSX',
                    suggestion: 'Use JSX comments: {/* comment */}',
                    code: line.trim()
                });
            }
        });
    }

    // Check for unclosed self-closing tags
    checkSelfClosingTags(content, filename) {
        const lines = content.split('\n');
        const selfClosingTags = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

        lines.forEach((line, index) => {
            selfClosingTags.forEach(tag => {
                const regex = new RegExp(`<${tag}[^>]*(?<!/)>`, 'gi');
                if (regex.test(line)) {
                    this.errors.push({
                        file: filename,
                        line: index + 1,
                        type: 'Unclosed Self-Closing Tag',
                        message: `<${tag}> tag should be self-closed in JSX`,
                        suggestion: `Use <${tag} ... /> instead of <${tag} ...>`,
                        code: line.trim()
                    });
                }
            });
        });
    }

    // Check for missing closing tags
    checkMissingClosingTags(content, filename) {
        const lines = content.split('\n');
        const tagStack = [];
        const selfClosingTags = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

        lines.forEach((line, index) => {
            // Find opening tags
            const openingTags = line.match(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*(?<!\/)>/g);
            if (openingTags) {
                openingTags.forEach(tag => {
                    const tagName = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/)[1].toLowerCase();
                    if (!selfClosingTags.includes(tagName)) {
                        tagStack.push({ tag: tagName, line: index + 1, fullTag: tag });
                    }
                });
            }

            // Find closing tags
            const closingTags = line.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/g);
            if (closingTags) {
                closingTags.forEach(tag => {
                    const tagName = tag.match(/<\/([a-zA-Z][a-zA-Z0-9]*)/)[1].toLowerCase();
                    const lastOpen = tagStack.pop();
                    if (!lastOpen || lastOpen.tag !== tagName) {
                        this.errors.push({
                            file: filename,
                            line: index + 1,
                            type: 'Mismatched Closing Tag',
                            message: `Closing tag </${tagName}> doesn't match expected opening tag`,
                            suggestion: lastOpen ? `Expected </${lastOpen.tag}>` : 'Remove this closing tag',
                            code: line.trim()
                        });
                    }
                });
            }
        });

        // Check for unclosed tags
        tagStack.forEach(unclosed => {
            this.errors.push({
                file: filename,
                line: unclosed.line,
                type: 'Unclosed Tag',
                message: `Opening tag <${unclosed.tag}> is never closed`,
                suggestion: `Add closing tag </${unclosed.tag}>`,
                code: unclosed.fullTag
            });
        });
    }

    // Check for malformed conditional rendering
    checkConditionalRendering(content, filename) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            // Check for && without proper boolean conversion
            const conditionalRegex = /\{[^}]*&&[^}]*\}/g;
            const matches = line.match(conditionalRegex);
            if (matches) {
                matches.forEach(match => {
                    // Check if condition might be falsy (like 0, '', null)
                    if (match.includes('.length &&') || match.includes('count &&') || match.includes('number &&')) {
                        this.warnings.push({
                            file: filename,
                            line: index + 1,
                            type: 'Potential Conditional Rendering Issue',
                            message: 'Conditional rendering might render 0 or empty string',
                            suggestion: 'Use !! or explicit boolean conversion: {!!condition && <Component />}',
                            code: line.trim()
                        });
                    }
                });
            }
        });
    }

    // Check for missing fragments
    checkMissingFragments(content, filename) {
        const lines = content.split('\n');
        let inReturn = false;
        let returnLineStart = -1;
        let elementCount = 0;

        lines.forEach((line, index) => {
            if (line.includes('return') && (line.includes('(') || lines[index + 1]?.trim().startsWith('('))) {
                inReturn = true;
                returnLineStart = index + 1;
                elementCount = 0;
            }

            if (inReturn) {
                // Count JSX elements at the same level
                const jsxElements = line.match(/<[a-zA-Z][^>]*>/g);
                if (jsxElements) {
                    elementCount += jsxElements.length;
                }

                if (line.includes(');') || line.includes(')')) {
                    if (elementCount > 1) {
                        this.errors.push({
                            file: filename,
                            line: returnLineStart,
                            type: 'Missing Fragment',
                            message: 'Multiple JSX elements must be wrapped in a fragment',
                            suggestion: 'Wrap elements in <React.Fragment> or <> </>',
                            code: 'Multiple adjacent JSX elements detected'
                        });
                    }
                    inReturn = false;
                }
            }
        });
    }

    // Check for missing semicolons in JSX expressions
    checkMissingSemicolons(content, filename) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            // Check for JSX expressions that might need semicolons
            if (line.includes('onClick=') || line.includes('onChange=') || line.includes('onSubmit=')) {
                const jsxExpressions = line.match(/\{[^}]+\}/g);
                if (jsxExpressions) {
                    jsxExpressions.forEach(expr => {
                        if (expr.includes('(') && expr.includes(')') && !expr.includes(';') && expr.includes('=')) {
                            this.warnings.push({
                                file: filename,
                                line: index + 1,
                                type: 'Potential Missing Semicolon',
                                message: 'JSX expression might need semicolon',
                                suggestion: 'Check if semicolon is needed in the expression',
                                code: line.trim()
                            });
                        }
                    });
                }
            }
        });
    }

    // Check for invalid JSX attribute names
    checkInvalidAttributes(content, filename) {
        const lines = content.split('\n');
        const htmlAttributes = {
            'class': 'className',
            'for': 'htmlFor',
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'maxlength': 'maxLength',
            'cellpadding': 'cellPadding',
            'cellspacing': 'cellSpacing',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder'
        };

        lines.forEach((line, index) => {
            Object.keys(htmlAttributes).forEach(htmlAttr => {
                const regex = new RegExp(`\\s${htmlAttr}=`, 'gi');
                if (regex.test(line)) {
                    this.errors.push({
                        file: filename,
                        line: index + 1,
                        type: 'Invalid JSX Attribute',
                        message: `HTML attribute "${htmlAttr}" should be "${htmlAttributes[htmlAttr]}" in JSX`,
                        suggestion: `Use ${htmlAttributes[htmlAttr]} instead of ${htmlAttr}`,
                        code: line.trim()
                    });
                }
            });
        });
    }

    // Main diagnostic function
    diagnoseFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const filename = path.basename(filePath);

            console.log(`\n🔍 Analyzing: ${filename}`);

            this.checkReactImport(content, filename);
            this.checkHTMLComments(content, filename);
            this.checkSelfClosingTags(content, filename);
            this.checkMissingClosingTags(content, filename);
            this.checkConditionalRendering(content, filename);
            this.checkMissingFragments(content, filename);
            this.checkMissingSemicolons(content, filename);
            this.checkInvalidAttributes(content, filename);

        } catch (error) {
            console.error(`❌ Error reading file ${filePath}:`, error.message);
        }
    }

    // Scan directory for React files
    scanDirectory(dirPath) {
        try {
            const files = fs.readdirSync(dirPath, { withFileTypes: true });

            files.forEach(file => {
                const fullPath = path.join(dirPath, file.name);

                if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
                    this.scanDirectory(fullPath);
                } else if (file.isFile() && (file.name.endsWith('.jsx') || file.name.endsWith('.tsx'))) {
                    this.diagnoseFile(fullPath);
                }
            });
        } catch (error) {
            console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
        }
    }

    // Generate report
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 JSX DIAGNOSTIC REPORT');
        console.log('='.repeat(60));

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('✅ No JSX issues found!');
            return;
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ ERRORS (${this.errors.length}):`);
            console.log('-'.repeat(40));

            this.errors.forEach((error, index) => {
                console.log(`\n${index + 1}. ${error.type}`);
                console.log(`   📁 File: ${error.file}`);
                console.log(`   📍 Line: ${error.line}`);
                console.log(`   💬 Message: ${error.message}`);
                console.log(`   💡 Suggestion: ${error.suggestion}`);
                if (error.code) {
                    console.log(`   📝 Code: ${error.code}`);
                }
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
            console.log('-'.repeat(40));

            this.warnings.forEach((warning, index) => {
                console.log(`\n${index + 1}. ${warning.type}`);
                console.log(`   📁 File: ${warning.file}`);
                console.log(`   📍 Line: ${warning.line}`);
                console.log(`   💬 Message: ${warning.message}`);
                console.log(`   💡 Suggestion: ${warning.suggestion}`);
                if (warning.code) {
                    console.log(`   📝 Code: ${warning.code}`);
                }
            });
        }

        console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
        console.log('='.repeat(60));
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('🔧 JSX Diagnostic Tool');
        console.log('Usage:');
        console.log('  node check-jsx.js <file-or-directory>');
        console.log('  node check-jsx.js src/');
        console.log('  node check-jsx.js components/MyComponent.jsx');
        console.log('\nThis tool checks for common JSX syntax errors including:');
        console.log('  • Missing React imports');
        console.log('  • HTML comments in JSX');
        console.log('  • Unclosed self-closing tags');
        console.log('  • Missing closing tags');
        console.log('  • Malformed conditional rendering');
        console.log('  • Missing fragments');
        console.log('  • Invalid JSX attributes');
        return;
    }

    const diagnostic = new JSXDiagnostic();
    const targetPath = args[0];

    if (!fs.existsSync(targetPath)) {
        console.error(`❌ Path does not exist: ${targetPath}`);
        return;
    }

    const stats = fs.statSync(targetPath);

    if (stats.isDirectory()) {
        console.log(`🔍 Scanning directory: ${targetPath}`);
        diagnostic.scanDirectory(targetPath);
    } else if (targetPath.endsWith('.jsx') || targetPath.endsWith('.tsx')) {
        diagnostic.diagnoseFile(targetPath);
    } else {
        console.error('❌ Please provide a .jsx/.tsx file or directory containing React components');
        return;
    }

    diagnostic.generateReport();
}

if (require.main === module) {
    main();
}

module.exports = JSXDiagnostic;
