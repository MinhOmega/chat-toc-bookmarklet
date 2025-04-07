#!/usr/bin/env node

/**
 * TOC.js Minifier that preserves the javascript: prefix
 * 
 * This script takes TOC.js and creates a minified version (TOC-min.js)
 * while preserving the 'javascript:' prefix needed for bookmarklets.
 * 
 * Usage:
 * 1. Install dependencies: npm install terser
 * 2. Run: node minify-toc.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// Paths
const sourcePath = path.join(__dirname, 'TOC.js');
const outputPath = path.join(__dirname, 'TOC-min.js');

// Read the source file
let jsContent;
try {
  jsContent = fs.readFileSync(sourcePath, 'utf8');
  console.log(`Read source file: ${sourcePath} (${jsContent.length} bytes)`);
} catch (err) {
  console.error(`Error reading source file: ${err.message}`);
  process.exit(1);
}

// Extract and preserve the 'javascript:' prefix
const jsPrefix = jsContent.match(/^(javascript:)/);
if (!jsPrefix) {
  console.error('Error: Source file does not start with "javascript:" prefix');
  process.exit(1);
}

// Remove the prefix for minification
const jsCodeWithoutPrefix = jsContent.replace(/^javascript:/, '');

// Enhanced minify options for maximum compression
const options = {
  compress: {
    drop_console: false,
    drop_debugger: true,
    ecma: 2020,
    passes: 3,           // More passes for better compression
    unsafe: true,        // Enable unsafe transformations for smaller output
    unsafe_comps: true,  // Optimize comparisons for smaller output
    pure_getters: true,  // Assume properties never have side-effects
    unsafe_methods: true,
    unsafe_proto: true,
    hoist_funs: true,
    booleans_as_integers: true  // Convert true/false to 1/0
  },
  mangle: {
    properties: {
      regex: /^_/        // Only mangle properties that start with underscore
    },
    toplevel: true       // Mangle variables in the top level scope
  },
  format: {
    comments: false,     // Remove all comments
    beautify: false,     // No beautification
    indent_level: 0,     // No indentation
    ascii_only: false,   // Allow non-ASCII characters
    quote_style: 0,      // Use double or single quotes depending on which one produces shorter output
    max_line_len: 0,     // No max line length
    semicolons: true     // Always use semicolons
  }
};

// Additional manual whitespace optimization
function extraOptimize(code) {
  return code
    .replace(/\s+/g, ' ')         // Replace multiple whitespace with single space
    .replace(/\s*([{}()[\],;:])\s*/g, '$1') // Remove spaces around brackets, braces, parentheses, commas, colons and semicolons
    .replace(/;\}/g, '}')         // Remove unnecessary semicolons before closing braces
    .replace(/\s*\+\s*/g, '+')    // Remove spaces around plus signs
    .replace(/\s*-\s*/g, '-')     // Remove spaces around minus signs
    .replace(/\s*\*\s*/g, '*')    // Remove spaces around multiplication signs
    .replace(/\s*\/\s*/g, '/')    // Remove spaces around division signs
    .replace(/\s*=\s*/g, '=')     // Remove spaces around equals signs
    .replace(/\s*>\s*/g, '>')     // Remove spaces around greater than signs
    .replace(/\s*<\s*/g, '<')     // Remove spaces around less than signs
    .replace(/\s*!\s*/g, '!')     // Remove spaces after exclamation marks
    .replace(/\s*\?\s*/g, '?')    // Remove spaces around question marks
    .replace(/\s*&&\s*/g, '&&')   // Remove spaces around logical AND
    .replace(/\s*\|\|\s*/g, '||')  // Remove spaces around logical OR
    .replace(/\s*:\s*/g, ':')     // Remove spaces around colons
    .replace(/\s+{/g, '{')        // Remove spaces before opening braces
    .replace(/}\s+/g, '}')        // Remove spaces after closing braces
    .replace(/\(\s+/g, '(')       // Remove spaces after opening parentheses
    .replace(/\s+\)/g, ')')       // Remove spaces before closing parentheses
    .trim();                      // Remove any leading/trailing whitespace
}

async function minifyCode() {
  try {
    console.log('Minifying code...');
    const result = await minify(jsCodeWithoutPrefix, options);
    
    if (result.error) {
      console.error('Error during minification:', result.error);
      process.exit(1);
    }
    
    // Further optimize the code
    let optimizedCode = extraOptimize(result.code);
    
    // Add back the javascript: prefix
    const minifiedWithPrefix = `${jsPrefix[0]}${optimizedCode}`;
    
    // Write to output file
    fs.writeFileSync(outputPath, minifiedWithPrefix);
    
    // Output stats
    const originalSize = jsContent.length;
    const minifiedSize = minifiedWithPrefix.length;
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    
    console.log(`
Minification complete!
- Original size: ${originalSize} bytes
- Minified size: ${minifiedSize} bytes
- Reduction:    ${reduction}%
- Saved to:     ${outputPath}
    `);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

minifyCode();