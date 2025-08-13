#!/usr/bin/env node

/**
 * Vercel Deployment Simulation Test
 * Simulates exactly what Vercel sees during deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VercelDeploymentTest {
  constructor() {
    this.results = [];
  }

  log(message, type = 'info') {
    const logEntry = { message, type, timestamp: new Date().toISOString() };
    this.results.push(logEntry);
    
    const emoji = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌'
    };
    
    console.log(`${emoji[type]} ${message}`);
  }

  async simulateVercelFunctionDetection() {
    this.log('Simulating Vercel function detection process...');
    
    const apiDir = path.join(__dirname, 'api');
    const vercelConfigPath = path.join(__dirname, 'vercel.json');
    
    // Read vercel.json
    let vercelConfig;
    try {
      const configContent = fs.readFileSync(vercelConfigPath, 'utf8');
      vercelConfig = JSON.parse(configContent);
      this.log('Successfully loaded vercel.json', 'success');
    } catch (error) {
      this.log(`Failed to load vercel.json: ${error.message}`, 'error');
      return false;
    }
    
    // Check if functions are explicitly defined
    if (!vercelConfig.functions) {
      this.log('No explicit functions configuration found', 'warning');
      return this.autoDetectFunctions(apiDir);
    }
    
    // Validate each explicitly configured function
    const configuredFunctions = Object.keys(vercelConfig.functions);
    this.log(`Found ${configuredFunctions.length} explicitly configured functions`);
    
    let allValid = true;
    
    for (const funcPath of configuredFunctions) {
      const fullPath = path.join(__dirname, funcPath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        this.log(`Function file does not exist: ${funcPath}`, 'error');
        allValid = false;
        continue;
      }
      
      // Check if it's a valid serverless function
      const isValid = await this.validateServerlessFunction(fullPath, funcPath);
      if (!isValid) {
        allValid = false;
      }
    }
    
    return allValid;
  }
  
  async autoDetectFunctions(apiDir) {
    this.log('Auto-detecting functions in api/ directory...');
    
    if (!fs.existsSync(apiDir)) {
      this.log('API directory does not exist', 'error');
      return false;
    }
    
    const jsFiles = this.findJSFiles(apiDir);
    this.log(`Found ${jsFiles.length} JavaScript files`);
    
    let allValid = true;
    
    for (const file of jsFiles) {
      const relativePath = path.relative(__dirname, file);
      const isValid = await this.validateServerlessFunction(file, relativePath);
      if (!isValid) {
        allValid = false;
      }
    }
    
    return allValid;
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
  
  async validateServerlessFunction(filePath, relativePath) {
    this.log(`Validating: ${relativePath}`);
    
    try {
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for syntax errors by trying to parse
      try {
        // Simple syntax check - try to create a function from the content
        new Function(content);
      } catch (syntaxError) {
        this.log(`Syntax error in ${relativePath}: ${syntaxError.message}`, 'error');
        return false;
      }
      
      // Check export patterns
      const hasDefaultExport = /export\s+default\s+/.test(content);
      const hasModuleExports = /module\.exports\s*=/.test(content);
      
      if (!hasDefaultExport && !hasModuleExports) {
        this.log(`No valid export found in ${relativePath}`, 'error');
        return false;
      }
      
      // Try to import the module
      try {
        const fileUrl = `file://${filePath}`;
        const module = await import(fileUrl);
        
        let handler = null;
        
        if (module.default && typeof module.default === 'function') {
          handler = module.default;
          this.log(`${relativePath}: Valid default export handler`, 'success');
        } else if (module.handler && typeof module.handler === 'function') {
          handler = module.handler;
          this.log(`${relativePath}: Valid named export handler`, 'success');
        } else {
          this.log(`${relativePath}: No valid handler function found`, 'error');
          return false;
        }
        
        // Test handler signature
        if (handler.length < 2) {
          this.log(`${relativePath}: Handler should accept (req, res) parameters`, 'warning');
        }
        
        return true;
        
      } catch (importError) {
        this.log(`Import failed for ${relativePath}: ${importError.message}`, 'error');
        return false;
      }
      
    } catch (error) {
      this.log(`Failed to validate ${relativePath}: ${error.message}`, 'error');
      return false;
    }
  }
  
  async testVercelPatternMatching() {
    this.log('Testing Vercel pattern matching...');
    
    const vercelConfigPath = path.join(__dirname, 'vercel.json');
    
    try {
      const configContent = fs.readFileSync(vercelConfigPath, 'utf8');
      const vercelConfig = JSON.parse(configContent);
      
      if (!vercelConfig.functions) {
        this.log('No functions configuration - using auto-detection', 'info');
        return true;
      }
      
      const configuredFunctions = Object.keys(vercelConfig.functions);
      
      // Test each pattern
      for (const pattern of configuredFunctions) {
        const fullPath = path.join(__dirname, pattern);
        
        if (pattern.includes('*')) {
          // Wildcard pattern
          this.log(`Testing wildcard pattern: ${pattern}`, 'info');
          
          // This is where the issue might be - Vercel might not be expanding wildcards correctly
          const matchingFiles = this.expandWildcardPattern(pattern);
          
          if (matchingFiles.length === 0) {
            this.log(`Wildcard pattern '${pattern}' matches no files`, 'error');
            return false;
          } else {
            this.log(`Wildcard pattern '${pattern}' matches ${matchingFiles.length} files`, 'success');
          }
          
        } else {
          // Exact file path
          if (!fs.existsSync(fullPath)) {
            this.log(`Exact path '${pattern}' does not exist`, 'error');
            return false;
          } else {
            this.log(`Exact path '${pattern}' exists`, 'success');
          }
        }
      }
      
      return true;
      
    } catch (error) {
      this.log(`Pattern matching test failed: ${error.message}`, 'error');
      return false;
    }
  }
  
  expandWildcardPattern(pattern) {
    // Simple wildcard expansion for testing
    const basePath = pattern.replace(/\*\*?\/\*\*?/, '').replace(/\*\*?/, '');
    const fullBasePath = path.join(__dirname, basePath);
    
    if (!fs.existsSync(fullBasePath)) {
      return [];
    }
    
    return this.findJSFiles(fullBasePath);
  }
  
  async checkEnvironmentCompatibility() {
    this.log('Checking environment compatibility...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`);
    
    // Check if ES modules are supported
    try {
      const testModule = 'data:text/javascript,export default function() { return "test"; }';
      const { default: testFunc } = await import(testModule);
      this.log('ES modules are supported', 'success');
    } catch (error) {
      this.log('ES modules are not supported', 'error');
      return false;
    }
    
    return true;
  }
  
  generateDeploymentReport() {
    console.log('\n' + '='.repeat(70));
    console.log('VERCEL DEPLOYMENT SIMULATION REPORT');
    console.log('='.repeat(70));
    
    const errors = this.results.filter(r => r.type === 'error');
    const warnings = this.results.filter(r => r.type === 'warning');
    const successes = this.results.filter(r => r.type === 'success');
    
    console.log(`\n📊 RESULTS:`);
    console.log(`   ✅ Successes: ${successes.length}`);
    console.log(`   ⚠️  Warnings: ${warnings.length}`);
    console.log(`   ❌ Errors: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ CRITICAL ISSUES:`);
      errors.forEach(error => {
        console.log(`   • ${error.message}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      warnings.forEach(warning => {
        console.log(`   • ${warning.message}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    
    if (errors.length === 0) {
      console.log('✅ DEPLOYMENT READY: All tests passed!');
      console.log('\n💡 NEXT STEPS:');
      console.log('   1. Commit your changes to Git');
      console.log('   2. Push to your GitHub repository');
      console.log('   3. Deploy via Vercel dashboard or CLI');
    } else {
      console.log('❌ DEPLOYMENT NOT READY: Fix the issues above first.');
      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('   1. Fix all critical issues listed above');
      console.log('   2. Re-run this test script');
      console.log('   3. Only deploy after all tests pass');
    }
    
    console.log('='.repeat(70));
  }
  
  async run() {
    console.log('🚀 Starting Vercel Deployment Simulation...\n');
    
    try {
      // Test environment compatibility
      const envOk = await this.checkEnvironmentCompatibility();
      if (!envOk) {
        this.log('Environment compatibility check failed', 'error');
        return;
      }
      
      // Test function detection
      const functionsOk = await this.simulateVercelFunctionDetection();
      if (!functionsOk) {
        this.log('Function detection failed', 'error');
      }
      
      // Test pattern matching
      const patternsOk = await this.testVercelPatternMatching();
      if (!patternsOk) {
        this.log('Pattern matching failed', 'error');
      }
      
    } catch (error) {
      this.log(`Simulation failed: ${error.message}`, 'error');
    }
    
    // Generate final report
    this.generateDeploymentReport();
  }
}

// Run the simulation
const test = new VercelDeploymentTest();
test.run().catch(console.error);