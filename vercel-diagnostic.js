#!/usr/bin/env node

/**
 * Vercel Deployment Diagnostic Script
 * Identifies issues with serverless function deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VercelDiagnostic {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.apiDir = path.join(__dirname, 'api');
    this.vercelConfigPath = path.join(__dirname, 'vercel.json');
  }

  log(type, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    switch (type) {
      case 'error':
        this.errors.push(logMessage);
        console.error(`❌ ${logMessage}`);
        break;
      case 'warning':
        this.warnings.push(logMessage);
        console.warn(`⚠️  ${logMessage}`);
        break;
      case 'info':
        this.info.push(logMessage);
        console.log(`ℹ️  ${logMessage}`);
        break;
      case 'success':
        console.log(`✅ ${logMessage}`);
        break;
    }
  }

  async checkApiDirectory() {
    this.log('info', 'Checking API directory structure...');
    
    if (!fs.existsSync(this.apiDir)) {
      this.log('error', 'API directory does not exist');
      return false;
    }

    const apiFiles = this.getAllJSFiles(this.apiDir);
    this.log('info', `Found ${apiFiles.length} JavaScript files in API directory`);
    
    apiFiles.forEach(file => {
      const relativePath = path.relative(__dirname, file);
      this.log('info', `API file: ${relativePath}`);
    });

    return apiFiles;
  }

  getAllJSFiles(dir) {
    let jsFiles = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        jsFiles = jsFiles.concat(this.getAllJSFiles(fullPath));
      } else if (item.endsWith('.js')) {
        jsFiles.push(fullPath);
      }
    }
    
    return jsFiles;
  }

  async checkVercelConfig() {
    this.log('info', 'Checking vercel.json configuration...');
    
    if (!fs.existsSync(this.vercelConfigPath)) {
      this.log('error', 'vercel.json does not exist');
      return null;
    }

    try {
      const configContent = fs.readFileSync(this.vercelConfigPath, 'utf8');
      const config = JSON.parse(configContent);
      
      this.log('success', 'vercel.json is valid JSON');
      
      if (config.functions) {
        this.log('info', `Found ${Object.keys(config.functions).length} functions in vercel.json`);
        
        Object.keys(config.functions).forEach(funcPath => {
          this.log('info', `Configured function: ${funcPath}`);
        });
      } else {
        this.log('warning', 'No functions configuration found in vercel.json');
      }
      
      return config;
    } catch (error) {
      this.log('error', `Failed to parse vercel.json: ${error.message}`);
      return null;
    }
  }

  async validateFunctionExports(apiFiles) {
    this.log('info', 'Validating function exports...');
    
    for (const file of apiFiles) {
      const relativePath = path.relative(__dirname, file);
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for export patterns
        const hasDefaultExport = /export\s+default\s+/.test(content);
        const hasModuleExports = /module\.exports\s*=/.test(content);
        const hasHandlerFunction = /function\s+handler\s*\(/.test(content) || /handler\s*=/.test(content);
        
        if (!hasDefaultExport && !hasModuleExports) {
          this.log('error', `${relativePath}: No export found`);
        } else if (hasDefaultExport && hasModuleExports) {
          this.log('warning', `${relativePath}: Mixed export styles (ES6 and CommonJS)`);
        } else if (hasDefaultExport) {
          this.log('success', `${relativePath}: Uses ES6 default export`);
        } else {
          this.log('success', `${relativePath}: Uses CommonJS export`);
        }
        
        if (!hasHandlerFunction) {
          this.log('warning', `${relativePath}: No handler function detected`);
        }
        
      } catch (error) {
        this.log('error', `${relativePath}: Failed to read file - ${error.message}`);
      }
    }
  }

  async checkConfigFileMatch(apiFiles, vercelConfig) {
    this.log('info', 'Checking if vercel.json matches actual API files...');
    
    if (!vercelConfig || !vercelConfig.functions) {
      this.log('warning', 'No functions configuration to compare');
      return;
    }
    
    const configuredFunctions = Object.keys(vercelConfig.functions);
    const actualFiles = apiFiles.map(file => {
      return path.relative(__dirname, file);
    });
    
    // Check if configured functions exist
    configuredFunctions.forEach(funcPath => {
      const fullPath = path.join(__dirname, funcPath);
      if (!fs.existsSync(fullPath)) {
        this.log('error', `Configured function does not exist: ${funcPath}`);
      } else {
        this.log('success', `Configured function exists: ${funcPath}`);
      }
    });
    
    // Check if actual files are configured
    actualFiles.forEach(filePath => {
      if (!configuredFunctions.includes(filePath)) {
        this.log('warning', `API file not configured in vercel.json: ${filePath}`);
      }
    });
  }

  async testFunctionImports(apiFiles) {
    this.log('info', 'Testing function imports...');
    
    for (const file of apiFiles) {
      const relativePath = path.relative(__dirname, file);
      
      try {
        // Try to import the function
        const fileUrl = `file://${file}`;
        const module = await import(fileUrl);
        
        if (module.default && typeof module.default === 'function') {
          this.log('success', `${relativePath}: Successfully imported default export`);
        } else if (module.handler && typeof module.handler === 'function') {
          this.log('success', `${relativePath}: Successfully imported handler export`);
        } else {
          this.log('error', `${relativePath}: No valid handler function found`);
        }
        
      } catch (error) {
        this.log('error', `${relativePath}: Import failed - ${error.message}`);
      }
    }
  }

  async checkPackageJson() {
    this.log('info', 'Checking package.json configuration...');
    
    const packagePath = path.join(__dirname, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      this.log('error', 'package.json does not exist');
      return;
    }
    
    try {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.type === 'module') {
        this.log('success', 'package.json configured for ES modules');
      } else {
        this.log('warning', 'package.json not configured for ES modules');
      }
      
      if (packageJson.engines && packageJson.engines.node) {
        this.log('info', `Node.js version specified: ${packageJson.engines.node}`);
      }
      
    } catch (error) {
      this.log('error', `Failed to parse package.json: ${error.message}`);
    }
  }

  async checkVercelIgnore() {
    this.log('info', 'Checking .vercelignore configuration...');
    
    const vercelIgnorePath = path.join(__dirname, '.vercelignore');
    
    if (!fs.existsSync(vercelIgnorePath)) {
      this.log('info', 'No .vercelignore file found');
      return;
    }
    
    try {
      const ignoreContent = fs.readFileSync(vercelIgnorePath, 'utf8');
      const ignoreLines = ignoreContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      this.log('info', `Found ${ignoreLines.length} ignore patterns`);
      
      // Check if api/ is being ignored
      const apiIgnored = ignoreLines.some(line => 
        line.trim() === 'api/' || 
        line.trim() === 'api' ||
        line.includes('api/')
      );
      
      if (apiIgnored) {
        this.log('error', 'API directory is being ignored by .vercelignore');
      } else {
        this.log('success', 'API directory is not being ignored');
      }
      
    } catch (error) {
      this.log('error', `Failed to read .vercelignore: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('VERCEL DEPLOYMENT DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Info: ${this.info.length}`);
    
    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0) {
      console.log('✅ No critical errors found. Deployment should work.');
    } else {
      console.log('❌ Critical errors found. Fix these before deploying.');
    }
    
    console.log('='.repeat(60));
  }

  async run() {
    console.log('🔍 Starting Vercel Deployment Diagnostic...\n');
    
    try {
      // Check API directory
      const apiFiles = await this.checkApiDirectory();
      if (!apiFiles) return;
      
      // Check vercel.json
      const vercelConfig = await this.checkVercelConfig();
      
      // Validate function exports
      await this.validateFunctionExports(apiFiles);
      
      // Check config file match
      await this.checkConfigFileMatch(apiFiles, vercelConfig);
      
      // Test function imports
      await this.testFunctionImports(apiFiles);
      
      // Check package.json
      await this.checkPackageJson();
      
      // Check .vercelignore
      await this.checkVercelIgnore();
      
    } catch (error) {
      this.log('error', `Diagnostic failed: ${error.message}`);
    }
    
    // Generate final report
    this.generateReport();
  }
}

// Run the diagnostic
const diagnostic = new VercelDiagnostic();
diagnostic.run().catch(console.error);