#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Vercel Deployment Simulator
 * Approach 3: Simulate exactly what Vercel would receive
 */

class VercelDeploymentSimulator {
  constructor() {
    this.projectRoot = process.cwd();
    this.simulationDir = path.join(this.projectRoot, 'vercel-simulation');
    this.vercelIgnorePath = path.join(this.projectRoot, '.vercelignore');
    this.vercelJsonPath = path.join(this.projectRoot, 'vercel.json');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
  }

  // Clean and create simulation directory
  setupSimulation() {
    console.log('🧹 Setting up deployment simulation...');
    
    if (fs.existsSync(this.simulationDir)) {
      fs.rmSync(this.simulationDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.simulationDir, { recursive: true });
    
    console.log(`✅ Simulation directory created: ${this.simulationDir}`);
  }

  // Parse .vercelignore patterns
  parseIgnorePatterns() {
    let patterns = [];
    
    if (fs.existsSync(this.vercelIgnorePath)) {
      const content = fs.readFileSync(this.vercelIgnorePath, 'utf8');
      patterns = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    }
    
    console.log(`📋 Loaded ${patterns.length} ignore patterns`);
    return patterns;
  }

  // Check if file should be ignored
  shouldIgnore(filePath, patterns) {
    for (const pattern of patterns) {
      // Handle directory patterns
      if (pattern.endsWith('/')) {
        const dirPattern = pattern.slice(0, -1);
        if (filePath.startsWith(dirPattern + '/') || filePath === dirPattern) {
          return true;
        }
      }
      // Handle wildcard patterns
      else if (pattern.includes('*')) {
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(filePath) || regex.test(path.basename(filePath))) {
          return true;
        }
      }
      // Handle exact matches
      else {
        if (filePath === pattern || 
            filePath.startsWith(pattern + '/') || 
            filePath.includes('/' + pattern + '/') ||
            filePath.endsWith('/' + pattern) ||
            path.basename(filePath) === pattern) {
          return true;
        }
      }
    }
    return false;
  }

  // Copy files that would be deployed
  copyDeploymentFiles(patterns) {
    console.log('📦 Copying deployment files...');
    
    const stats = {
      totalFiles: 0,
      copiedFiles: 0,
      ignoredFiles: 0,
      totalSize: 0,
      copiedSize: 0,
      ignoredSize: 0,
      errors: []
    };

    const copyRecursive = (srcDir, destDir, relativePath = '') => {
      const items = fs.readdirSync(srcDir);
      
      for (const item of items) {
        const srcPath = path.join(srcDir, item);
        const relPath = path.join(relativePath, item);
        const destPath = path.join(destDir, item);
        
        // Skip .git and simulation directory itself
        if (item === '.git' || srcPath === this.simulationDir) continue;
        
        try {
          const stat = fs.statSync(srcPath);
          stats.totalFiles++;
          
          if (stat.isDirectory()) {
            if (!this.shouldIgnore(relPath, patterns)) {
              fs.mkdirSync(destPath, { recursive: true });
              copyRecursive(srcPath, destPath, relPath);
            } else {
              stats.ignoredFiles++;
            }
          } else {
            stats.totalSize += stat.size;
            
            if (!this.shouldIgnore(relPath, patterns)) {
              // Ensure destination directory exists
              fs.mkdirSync(path.dirname(destPath), { recursive: true });
              fs.copyFileSync(srcPath, destPath);
              stats.copiedFiles++;
              stats.copiedSize += stat.size;
            } else {
              stats.ignoredFiles++;
              stats.ignoredSize += stat.size;
            }
          }
        } catch (error) {
          stats.errors.push({ file: relPath, error: error.message });
        }
      }
    };

    copyRecursive(this.projectRoot, this.simulationDir);
    return stats;
  }

  // Analyze the simulated deployment
  analyzeDeployment() {
    console.log('\n🔍 Analyzing simulated deployment...');
    
    const analysis = {
      structure: {},
      criticalFiles: {},
      potentialIssues: [],
      recommendations: []
    };

    // Analyze directory structure
    const analyzeDir = (dir, relativePath = '') => {
      const items = fs.readdirSync(dir);
      const structure = {};
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const relPath = path.join(relativePath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          structure[item] = {
            type: 'directory',
            children: analyzeDir(itemPath, relPath)
          };
        } else {
          structure[item] = {
            type: 'file',
            size: stat.size,
            path: relPath
          };
        }
      }
      
      return structure;
    };

    analysis.structure = analyzeDir(this.simulationDir);

    // Check for critical files
    const checkCriticalFiles = (structure, basePath = '') => {
      for (const [name, info] of Object.entries(structure)) {
        const fullPath = path.join(basePath, name);
        
        if (info.type === 'file') {
          // API functions
          if (fullPath.startsWith('api/') && fullPath.endsWith('.js')) {
            analysis.criticalFiles.apiFunction = analysis.criticalFiles.apiFunction || [];
            analysis.criticalFiles.apiFunction.push(fullPath);
          }
          // Config files
          else if (['vercel.json', 'package.json'].includes(name)) {
            analysis.criticalFiles.config = analysis.criticalFiles.config || [];
            analysis.criticalFiles.config.push(fullPath);
          }
          // Built frontend
          else if (fullPath.startsWith('dist/')) {
            analysis.criticalFiles.frontend = analysis.criticalFiles.frontend || [];
            analysis.criticalFiles.frontend.push(fullPath);
          }
          // Source files (should be excluded)
          else if (fullPath.startsWith('src/')) {
            analysis.potentialIssues.push({
              type: 'unnecessary_source',
              file: fullPath,
              message: 'Source files should not be deployed'
            });
          }
          // Large files
          else if (info.size > 1024 * 1024) { // > 1MB
            analysis.potentialIssues.push({
              type: 'large_file',
              file: fullPath,
              size: info.size,
              message: `Large file (${this.formatSize(info.size)}) may slow deployment`
            });
          }
        } else {
          checkCriticalFiles(info.children, fullPath);
        }
      }
    };

    checkCriticalFiles(analysis.structure);

    // Generate recommendations
    if (!analysis.criticalFiles.apiFunction || analysis.criticalFiles.apiFunction.length === 0) {
      analysis.recommendations.push({
        type: 'error',
        message: 'No API functions found in deployment - this will cause function pattern errors'
      });
    }

    if (!analysis.criticalFiles.config || !analysis.criticalFiles.config.includes('vercel.json')) {
      analysis.recommendations.push({
        type: 'warning',
        message: 'vercel.json not found in deployment'
      });
    }

    if (!analysis.criticalFiles.frontend || analysis.criticalFiles.frontend.length === 0) {
      analysis.recommendations.push({
        type: 'warning',
        message: 'No built frontend files found - make sure to run build first'
      });
    }

    return analysis;
  }

  // Validate Vercel configuration
  validateVercelConfig() {
    console.log('\n⚙️  Validating Vercel configuration...');
    
    const validation = {
      vercelJson: { exists: false, valid: false, issues: [] },
      packageJson: { exists: false, valid: false, issues: [] },
      apiStructure: { valid: false, issues: [] }
    };

    // Check vercel.json
    const vercelJsonSim = path.join(this.simulationDir, 'vercel.json');
    if (fs.existsSync(vercelJsonSim)) {
      validation.vercelJson.exists = true;
      try {
        const config = JSON.parse(fs.readFileSync(vercelJsonSim, 'utf8'));
        validation.vercelJson.valid = true;
        validation.vercelJson.config = config;
        
        // Check for function definitions
        if (config.functions) {
          for (const [pattern, settings] of Object.entries(config.functions)) {
            const apiFile = path.join(this.simulationDir, pattern);
            if (!fs.existsSync(apiFile)) {
              validation.vercelJson.issues.push(`Function pattern '${pattern}' doesn't match any file`);
            }
          }
        }
      } catch (error) {
        validation.vercelJson.issues.push(`Invalid JSON: ${error.message}`);
      }
    } else {
      validation.vercelJson.issues.push('vercel.json not found in deployment');
    }

    // Check package.json
    const packageJsonSim = path.join(this.simulationDir, 'package.json');
    if (fs.existsSync(packageJsonSim)) {
      validation.packageJson.exists = true;
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonSim, 'utf8'));
        validation.packageJson.valid = true;
        validation.packageJson.config = pkg;
        
        if (pkg.type === 'module' && validation.vercelJson.config) {
          validation.packageJson.issues.push('ES modules may cause issues with Vercel functions');
        }
      } catch (error) {
        validation.packageJson.issues.push(`Invalid JSON: ${error.message}`);
      }
    }

    // Check API structure
    const apiDir = path.join(this.simulationDir, 'api');
    if (fs.existsSync(apiDir)) {
      const apiFiles = fs.readdirSync(apiDir, { recursive: true })
        .filter(file => file.endsWith('.js'));
      
      validation.apiStructure.valid = apiFiles.length > 0;
      validation.apiStructure.files = apiFiles;
      
      // Check each API file
      for (const file of apiFiles) {
        const filePath = path.join(apiDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for proper export
          if (!content.includes('module.exports') && !content.includes('export default')) {
            validation.apiStructure.issues.push(`${file}: No proper export found`);
          }
          
          // Check for handler function
          if (!content.includes('function') && !content.includes('=>')) {
            validation.apiStructure.issues.push(`${file}: No function found`);
          }
        } catch (error) {
          validation.apiStructure.issues.push(`${file}: ${error.message}`);
        }
      }
    } else {
      validation.apiStructure.issues.push('No api directory found');
    }

    return validation;
  }

  // Format file size
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate comprehensive report
  generateReport(stats, analysis, validation) {
    console.log('\n📊 VERCEL DEPLOYMENT SIMULATION REPORT');
    console.log('=' .repeat(60));
    
    // Deployment stats
    console.log('\n📦 DEPLOYMENT STATISTICS:');
    console.log(`  Total files scanned: ${stats.totalFiles}`);
    console.log(`  Files to deploy: ${stats.copiedFiles}`);
    console.log(`  Files ignored: ${stats.ignoredFiles}`);
    console.log(`  Deployment size: ${this.formatSize(stats.copiedSize)}`);
    console.log(`  Excluded size: ${this.formatSize(stats.ignoredSize)}`);
    console.log(`  Size reduction: ${((stats.ignoredSize / stats.totalSize) * 100).toFixed(1)}%`);
    
    if (stats.errors.length > 0) {
      console.log(`\n❌ ERRORS (${stats.errors.length}):`);
      stats.errors.forEach(err => console.log(`  - ${err.file}: ${err.error}`));
    }

    // Critical files analysis
    console.log('\n🔍 CRITICAL FILES ANALYSIS:');
    for (const [category, files] of Object.entries(analysis.criticalFiles)) {
      console.log(`  ${category}: ${files ? files.length : 0} files`);
      if (files && files.length > 0) {
        files.slice(0, 5).forEach(f => console.log(`    - ${f}`));
        if (files.length > 5) console.log(`    ... and ${files.length - 5} more`);
      }
    }

    // Potential issues
    if (analysis.potentialIssues.length > 0) {
      console.log(`\n⚠️  POTENTIAL ISSUES (${analysis.potentialIssues.length}):`);
      analysis.potentialIssues.forEach(issue => {
        console.log(`  - ${issue.type}: ${issue.file} - ${issue.message}`);
      });
    }

    // Configuration validation
    console.log('\n⚙️  CONFIGURATION VALIDATION:');
    console.log(`  vercel.json: ${validation.vercelJson.exists ? '✅' : '❌'} ${validation.vercelJson.valid ? 'Valid' : 'Invalid'}`);
    console.log(`  package.json: ${validation.packageJson.exists ? '✅' : '❌'} ${validation.packageJson.valid ? 'Valid' : 'Invalid'}`);
    console.log(`  API structure: ${validation.apiStructure.valid ? '✅' : '❌'} ${validation.apiStructure.files ? validation.apiStructure.files.length + ' files' : 'No files'}`);
    
    // Show validation issues
    const allIssues = [
      ...validation.vercelJson.issues.map(i => `vercel.json: ${i}`),
      ...validation.packageJson.issues.map(i => `package.json: ${i}`),
      ...validation.apiStructure.issues.map(i => `API: ${i}`)
    ];
    
    if (allIssues.length > 0) {
      console.log('\n🚨 CONFIGURATION ISSUES:');
      allIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      analysis.recommendations.forEach(rec => {
        const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : '💡';
        console.log(`  ${icon} ${rec.message}`);
      });
    }

    return {
      stats,
      analysis,
      validation,
      timestamp: new Date().toISOString()
    };
  }

  // Main simulation function
  run() {
    console.log('🚀 Starting Vercel Deployment Simulation...');
    
    this.setupSimulation();
    const patterns = this.parseIgnorePatterns();
    const stats = this.copyDeploymentFiles(patterns);
    const analysis = this.analyzeDeployment();
    const validation = this.validateVercelConfig();
    const report = this.generateReport(stats, analysis, validation);
    
    // Save detailed report
    fs.writeFileSync(
      path.join(this.projectRoot, 'vercel-deployment-simulation.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n💾 Simulation report saved to: vercel-deployment-simulation.json');
    console.log(`📁 Simulated deployment available at: ${this.simulationDir}`);
    console.log('\n✅ Vercel deployment simulation complete!');
    
    return report;
  }
}

// Run the simulator
if (require.main === module) {
  const simulator = new VercelDeploymentSimulator();
  simulator.run();
}

module.exports = VercelDeploymentSimulator;