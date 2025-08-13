#!/usr/bin/env node

/**
 * Convert ES6 modules to CommonJS for Vercel compatibility
 * This fixes the "unmatched function pattern" error
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ES6ToCommonJSConverter {
  constructor() {
    this.conversions = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const emoji = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌'
    };
    
    console.log(`${emoji[type]} ${message}`);
  }

  findJSFiles(dir) {
    let jsFiles = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        jsFiles = jsFiles.concat(this.findJSFiles(fullPath));
      } else if (item.endsWith('.js')) {
        jsFiles.push(fullPath);
      }
    }
    
    return jsFiles;
  }

  convertES6ToCommonJS(content) {
    let converted = content;
    
    // Convert ES6 imports to require statements
    // Handle: import { Groq } from 'groq-sdk';
    converted = converted.replace(
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"];?/g,
      'const { $1 } = require("$2");'
    );
    
    // Handle: import defaultExport from 'module';
    converted = converted.replace(
      /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"]([^'"]+)['"];?/g,
      'const $1 = require("$2");'
    );
    
    // Handle: import * as name from 'module';
    converted = converted.replace(
      /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"]([^'"]+)['"];?/g,
      'const $1 = require("$2");'
    );
    
    // Convert export default function to module.exports
    // Handle: export default function handler(req, res) { ... }
    converted = converted.replace(
      /export\s+default\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      'function $1('
    );
    
    // Handle: export default async function handler(req, res) { ... }
    converted = converted.replace(
      /export\s+default\s+async\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
      'async function $1('
    );
    
    // Add module.exports at the end if we found a handler function
    if (converted.includes('function handler(') || converted.includes('async function handler(')) {
      converted += '\n\nmodule.exports = handler;';
    }
    
    return converted;
  }

  async convertFile(filePath) {
    const relativePath = path.relative(__dirname, filePath);
    
    try {
      // Read original content
      const originalContent = fs.readFileSync(filePath, 'utf8');
      
      // Check if it's already CommonJS
      if (originalContent.includes('module.exports') && !originalContent.includes('export default')) {
        this.log(`${relativePath}: Already in CommonJS format`, 'info');
        return true;
      }
      
      // Check if it uses ES6 modules
      if (!originalContent.includes('export default') && !originalContent.includes('import ')) {
        this.log(`${relativePath}: No ES6 modules detected`, 'info');
        return true;
      }
      
      // Create backup
      const backupPath = filePath + '.es6.backup';
      fs.writeFileSync(backupPath, originalContent);
      this.log(`${relativePath}: Created backup at ${path.basename(backupPath)}`);
      
      // Convert to CommonJS
      const convertedContent = this.convertES6ToCommonJS(originalContent);
      
      // Write converted content
      fs.writeFileSync(filePath, convertedContent);
      
      this.conversions.push({
        file: relativePath,
        backup: backupPath,
        success: true
      });
      
      this.log(`${relativePath}: Successfully converted to CommonJS`, 'success');
      return true;
      
    } catch (error) {
      this.errors.push({
        file: relativePath,
        error: error.message
      });
      
      this.log(`${relativePath}: Conversion failed - ${error.message}`, 'error');
      return false;
    }
  }

  async convertAllAPIFiles() {
    this.log('Converting all API files from ES6 to CommonJS...');
    
    const apiDir = path.join(__dirname, 'api');
    
    if (!fs.existsSync(apiDir)) {
      this.log('API directory does not exist', 'error');
      return false;
    }
    
    const jsFiles = this.findJSFiles(apiDir);
    this.log(`Found ${jsFiles.length} JavaScript files to process`);
    
    let allSuccess = true;
    
    for (const file of jsFiles) {
      const success = await this.convertFile(file);
      if (!success) {
        allSuccess = false;
      }
    }
    
    return allSuccess;
  }

  async updatePackageJson() {
    this.log('Updating package.json for CommonJS compatibility...');
    
    const packagePath = path.join(__dirname, 'package.json');
    
    try {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      // Remove "type": "module" for serverless functions
      if (packageJson.type === 'module') {
        delete packageJson.type;
        
        // Create backup
        const backupPath = packagePath + '.module.backup';
        fs.writeFileSync(backupPath, packageContent);
        this.log('Created package.json backup');
        
        // Write updated package.json
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        
        this.log('Removed "type": "module" from package.json', 'success');
        return true;
      } else {
        this.log('package.json already compatible with CommonJS');
        return true;
      }
      
    } catch (error) {
      this.log(`Failed to update package.json: ${error.message}`, 'error');
      return false;
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('ES6 TO COMMONJS CONVERSION REPORT');
    console.log('='.repeat(70));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Successful conversions: ${this.conversions.length}`);
    console.log(`   ❌ Failed conversions: ${this.errors.length}`);
    
    if (this.conversions.length > 0) {
      console.log(`\n✅ CONVERTED FILES:`);
      this.conversions.forEach(conv => {
        console.log(`   • ${conv.file}`);
      });
    }
    
    if (this.errors.length > 0) {
      console.log(`\n❌ CONVERSION ERRORS:`);
      this.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    
    if (this.errors.length === 0) {
      console.log('✅ CONVERSION COMPLETE!');
      console.log('\n🚀 NEXT STEPS:');
      console.log('   1. Test the converted functions locally');
      console.log('   2. Commit and push to GitHub');
      console.log('   3. Deploy to Vercel');
      console.log('\n💡 ROLLBACK INSTRUCTIONS:');
      console.log('   • To restore ES6 modules, use the .es6.backup files');
      console.log('   • Restore package.json from .module.backup if needed');
    } else {
      console.log('❌ CONVERSION INCOMPLETE');
      console.log('   Fix the errors above and try again.');
    }
    
    console.log('='.repeat(70));
  }

  async run() {
    console.log('🔄 Starting ES6 to CommonJS conversion...\n');
    
    try {
      // Convert API files
      const filesOk = await this.convertAllAPIFiles();
      
      // Update package.json
      const packageOk = await this.updatePackageJson();
      
      if (!filesOk || !packageOk) {
        this.log('Conversion completed with errors', 'warning');
      } else {
        this.log('All conversions completed successfully', 'success');
      }
      
    } catch (error) {
      this.log(`Conversion failed: ${error.message}`, 'error');
    }
    
    // Generate final report
    this.generateReport();
  }
}

// Run the converter
const converter = new ES6ToCommonJSConverter();
converter.run().catch(console.error);