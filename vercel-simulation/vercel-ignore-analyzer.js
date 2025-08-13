#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Comprehensive .vercelignore Analysis Tool
 * Approach 1: Analyze which files are included vs excluded
 */

class VercelIgnoreAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.vercelIgnorePath = path.join(this.projectRoot, '.vercelignore');
    this.ignorePatterns = [];
    this.allFiles = [];
    this.includedFiles = [];
    this.excludedFiles = [];
  }

  // Parse .vercelignore file
  parseVercelIgnore() {
    if (!fs.existsSync(this.vercelIgnorePath)) {
      console.log('❌ No .vercelignore file found');
      return;
    }

    const content = fs.readFileSync(this.vercelIgnorePath, 'utf8');
    this.ignorePatterns = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    console.log('📋 Found ignore patterns:', this.ignorePatterns.length);
    this.ignorePatterns.forEach(pattern => console.log(`  - ${pattern}`));
  }

  // Get all files in project
  getAllFiles(dir = this.projectRoot, relativePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      
      // Skip .git and .vercel directories
      if (item === '.git' || item === '.vercel') continue;

      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, relPath));
      } else {
        files.push({
          path: relPath,
          fullPath: fullPath,
          size: stat.size,
          isDirectory: false
        });
      }
    }

    return files;
  }

  // Check if a file matches ignore patterns
  isIgnored(filePath) {
    for (const pattern of this.ignorePatterns) {
      // Handle different pattern types
      if (pattern.endsWith('/')) {
        // Directory pattern
        const dirPattern = pattern.slice(0, -1);
        if (filePath.startsWith(dirPattern + '/') || filePath === dirPattern) {
          return true;
        }
      } else if (pattern.includes('*')) {
        // Wildcard pattern - convert to regex
        const regexPattern = pattern
          .replace(/\./g, '\\.')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(filePath) || regex.test(path.basename(filePath))) {
          return true;
        }
      } else {
        // Exact match or path contains pattern
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

  // Analyze files
  analyzeFiles() {
    console.log('\n🔍 Scanning all project files...');
    this.allFiles = this.getAllFiles();
    
    for (const file of this.allFiles) {
      if (this.isIgnored(file.path)) {
        this.excludedFiles.push(file);
      } else {
        this.includedFiles.push(file);
      }
    }
  }

  // Calculate sizes
  calculateSizes(files) {
    return files.reduce((total, file) => total + file.size, 0);
  }

  // Format file size
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate report
  generateReport() {
    const includedSize = this.calculateSizes(this.includedFiles);
    const excludedSize = this.calculateSizes(this.excludedFiles);
    const totalSize = includedSize + excludedSize;

    console.log('\n📊 VERCEL IGNORE ANALYSIS REPORT');
    console.log('=' .repeat(50));
    
    console.log(`\n📁 Total Files: ${this.allFiles.length}`);
    console.log(`✅ Included Files: ${this.includedFiles.length}`);
    console.log(`❌ Excluded Files: ${this.excludedFiles.length}`);
    
    console.log(`\n💾 Total Project Size: ${this.formatSize(totalSize)}`);
    console.log(`📤 Deployment Size: ${this.formatSize(includedSize)}`);
    console.log(`🗑️  Excluded Size: ${this.formatSize(excludedSize)}`);
    console.log(`📉 Size Reduction: ${((excludedSize / totalSize) * 100).toFixed(1)}%`);

    // Critical files that should be included
    console.log('\n🔍 CRITICAL FILES ANALYSIS:');
    console.log('-'.repeat(30));
    
    const criticalPatterns = [
      { pattern: /^api\/.*\.js$/, name: 'API Functions' },
      { pattern: /^vercel\.json$/, name: 'Vercel Config' },
      { pattern: /^package\.json$/, name: 'Package Config' },
      { pattern: /^dist\//, name: 'Built Frontend' },
      { pattern: /^index\.html$/, name: 'Main HTML' }
    ];

    for (const { pattern, name } of criticalPatterns) {
      const criticalFiles = this.includedFiles.filter(f => pattern.test(f.path));
      const excludedCritical = this.excludedFiles.filter(f => pattern.test(f.path));
      
      console.log(`\n${name}:`);
      console.log(`  ✅ Included: ${criticalFiles.length}`);
      if (excludedCritical.length > 0) {
        console.log(`  ⚠️  EXCLUDED: ${excludedCritical.length}`);
        excludedCritical.forEach(f => console.log(`    - ${f.path}`));
      }
    }

    // Show largest included files
    console.log('\n📦 LARGEST INCLUDED FILES:');
    console.log('-'.repeat(30));
    const largestIncluded = this.includedFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
    
    largestIncluded.forEach(file => {
      console.log(`${this.formatSize(file.size).padStart(8)} - ${file.path}`);
    });

    // Show all included files by category
    console.log('\n📋 ALL INCLUDED FILES BY CATEGORY:');
    console.log('-'.repeat(40));
    
    const categories = {
      'API Functions': this.includedFiles.filter(f => f.path.startsWith('api/')),
      'Config Files': this.includedFiles.filter(f => /\.(json|js|ts)$/.test(f.path) && !f.path.startsWith('api/') && !f.path.startsWith('src/')),
      'Built Assets': this.includedFiles.filter(f => f.path.startsWith('dist/')),
      'Source Files': this.includedFiles.filter(f => f.path.startsWith('src/')),
      'Documentation': this.includedFiles.filter(f => /\.(md|txt)$/i.test(f.path)),
      'Other': this.includedFiles.filter(f => 
        !f.path.startsWith('api/') && 
        !f.path.startsWith('dist/') && 
        !f.path.startsWith('src/') &&
        !/\.(json|js|ts|md|txt)$/i.test(f.path)
      )
    };

    for (const [category, files] of Object.entries(categories)) {
      if (files.length > 0) {
        console.log(`\n${category} (${files.length} files):`);
        files.forEach(f => console.log(`  - ${f.path} (${this.formatSize(f.size)})`));
      }
    }
  }

  // Main analysis function
  run() {
    console.log('🚀 Starting Vercel Ignore Analysis...');
    this.parseVercelIgnore();
    this.analyzeFiles();
    this.generateReport();
    
    // Save detailed report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.allFiles.length,
        includedFiles: this.includedFiles.length,
        excludedFiles: this.excludedFiles.length,
        includedSize: this.calculateSizes(this.includedFiles),
        excludedSize: this.calculateSizes(this.excludedFiles)
      },
      includedFiles: this.includedFiles.map(f => ({ path: f.path, size: f.size })),
      excludedFiles: this.excludedFiles.map(f => ({ path: f.path, size: f.size })),
      ignorePatterns: this.ignorePatterns
    };
    
    fs.writeFileSync('vercel-ignore-analysis.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 Detailed report saved to: vercel-ignore-analysis.json');
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new VercelIgnoreAnalyzer();
  analyzer.run();
}

module.exports = VercelIgnoreAnalyzer;