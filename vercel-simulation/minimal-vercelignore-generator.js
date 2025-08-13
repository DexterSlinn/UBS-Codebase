#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Minimal .vercelignore Generator
 * Approach 2: Create the most minimal .vercelignore possible
 */

class MinimalVercelIgnoreGenerator {
  constructor() {
    this.projectRoot = process.cwd();
    this.currentVercelIgnore = path.join(this.projectRoot, '.vercelignore');
    this.minimalVercelIgnore = path.join(this.projectRoot, '.vercelignore.minimal');
    this.comparisonReport = path.join(this.projectRoot, 'vercelignore-comparison.json');
  }

  // Generate minimal .vercelignore with only absolute essentials
  generateMinimal() {
    console.log('🔧 Generating minimal .vercelignore...');
    
    // Only exclude the most critical items that would break deployment or cause issues
    const minimalIgnorePatterns = [
      '# Minimal .vercelignore - Only absolute essentials',
      '',
      '# Version control',
      '.git/',
      '',
      '# Environment files with secrets',
      '.env',
      '.env.local',
      '.env.*.local',
      '',
      '# Node modules (if using build step)',
      'node_modules/',
      '',
      '# Cache directories',
      '.cache/',
      '.next/',
      '.nuxt/',
      '',
      '# Log files',
      '*.log',
      'logs/',
      '',
      '# OS generated files',
      '.DS_Store',
      'Thumbs.db',
      '',
      '# IDE files',
      '.vscode/',
      '.idea/',
      '*.swp',
      '*.swo',
      '',
      '# Large font files (if not needed)',
      '*.woff',
      '*.woff2',
      '*.ttf',
      '*.otf'
    ];

    const minimalContent = minimalIgnorePatterns.join('\n');
    fs.writeFileSync(this.minimalVercelIgnore, minimalContent);
    
    console.log(`✅ Minimal .vercelignore created: ${this.minimalVercelIgnore}`);
    return minimalContent;
  }

  // Compare current vs minimal
  compareIgnoreFiles() {
    console.log('\n📊 Comparing current vs minimal .vercelignore...');
    
    // Read current .vercelignore
    let currentPatterns = [];
    if (fs.existsSync(this.currentVercelIgnore)) {
      const currentContent = fs.readFileSync(this.currentVercelIgnore, 'utf8');
      currentPatterns = currentContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    }

    // Read minimal .vercelignore
    const minimalContent = fs.readFileSync(this.minimalVercelIgnore, 'utf8');
    const minimalPatterns = minimalContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    // Find differences
    const onlyInCurrent = currentPatterns.filter(p => !minimalPatterns.includes(p));
    const onlyInMinimal = minimalPatterns.filter(p => !currentPatterns.includes(p));
    const common = currentPatterns.filter(p => minimalPatterns.includes(p));

    console.log(`\n📋 Pattern Comparison:`);
    console.log(`  Current patterns: ${currentPatterns.length}`);
    console.log(`  Minimal patterns: ${minimalPatterns.length}`);
    console.log(`  Common patterns: ${common.length}`);
    console.log(`  Only in current: ${onlyInCurrent.length}`);
    console.log(`  Only in minimal: ${onlyInMinimal.length}`);

    if (onlyInCurrent.length > 0) {
      console.log('\n🔍 Patterns only in CURRENT .vercelignore:');
      onlyInCurrent.forEach(pattern => console.log(`  - ${pattern}`));
    }

    if (onlyInMinimal.length > 0) {
      console.log('\n🔍 Patterns only in MINIMAL .vercelignore:');
      onlyInMinimal.forEach(pattern => console.log(`  - ${pattern}`));
    }

    return {
      current: currentPatterns,
      minimal: minimalPatterns,
      common,
      onlyInCurrent,
      onlyInMinimal
    };
  }

  // Simulate what would be included with minimal ignore
  simulateMinimalDeployment() {
    console.log('\n🎯 Simulating deployment with minimal .vercelignore...');
    
    // Temporarily backup current .vercelignore
    const backupPath = this.currentVercelIgnore + '.backup';
    if (fs.existsSync(this.currentVercelIgnore)) {
      fs.copyFileSync(this.currentVercelIgnore, backupPath);
    }

    try {
      // Replace with minimal version
      fs.copyFileSync(this.minimalVercelIgnore, this.currentVercelIgnore);
      
      // Run analyzer with minimal ignore
      const VercelIgnoreAnalyzer = require('./vercel-ignore-analyzer.js');
      const analyzer = new VercelIgnoreAnalyzer();
      
      console.log('\n🔄 Running analysis with minimal .vercelignore...');
      analyzer.parseVercelIgnore();
      analyzer.analyzeFiles();
      
      const minimalIncludedSize = analyzer.calculateSizes(analyzer.includedFiles);
      const minimalExcludedSize = analyzer.calculateSizes(analyzer.excludedFiles);
      
      console.log(`\n📦 MINIMAL IGNORE RESULTS:`);
      console.log(`  Included files: ${analyzer.includedFiles.length}`);
      console.log(`  Excluded files: ${analyzer.excludedFiles.length}`);
      console.log(`  Deployment size: ${analyzer.formatSize(minimalIncludedSize)}`);
      console.log(`  Excluded size: ${analyzer.formatSize(minimalExcludedSize)}`);
      
      // Check for potentially problematic inclusions
      const problematicFiles = analyzer.includedFiles.filter(f => 
        f.path.startsWith('src/') || 
        f.path.includes('test') ||
        f.path.includes('.backup') ||
        f.path.includes('README') ||
        f.path.includes('.md') ||
        f.size > 1024 * 1024 // Files larger than 1MB
      );
      
      if (problematicFiles.length > 0) {
        console.log('\n⚠️  POTENTIALLY PROBLEMATIC INCLUSIONS:');
        problematicFiles.forEach(f => {
          console.log(`  - ${f.path} (${analyzer.formatSize(f.size)})`);
        });
      }
      
      return {
        includedFiles: analyzer.includedFiles.length,
        excludedFiles: analyzer.excludedFiles.length,
        deploymentSize: minimalIncludedSize,
        excludedSize: minimalExcludedSize,
        problematicFiles: problematicFiles.length
      };
      
    } finally {
      // Restore original .vercelignore
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, this.currentVercelIgnore);
        fs.unlinkSync(backupPath);
      }
    }
  }

  // Generate recommendations
  generateRecommendations(comparison, minimalResults) {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('='.repeat(50));
    
    const recommendations = [];
    
    // Check if current ignore is too aggressive
    if (comparison.onlyInCurrent.length > 10) {
      recommendations.push({
        type: 'warning',
        message: `Current .vercelignore has ${comparison.onlyInCurrent.length} extra patterns that might be unnecessarily excluding files`
      });
    }
    
    // Check deployment size
    if (minimalResults.deploymentSize > 50 * 1024 * 1024) { // 50MB
      recommendations.push({
        type: 'error',
        message: `Minimal deployment size (${this.formatSize(minimalResults.deploymentSize)}) is very large - need more exclusions`
      });
    }
    
    // Check for problematic files
    if (minimalResults.problematicFiles > 0) {
      recommendations.push({
        type: 'warning',
        message: `${minimalResults.problematicFiles} potentially problematic files would be included with minimal ignore`
      });
    }
    
    // Specific pattern recommendations
    const criticalPatterns = ['src/', 'tests/', '*.md', '*.backup', 'knowledge-base/'];
    const missingCritical = criticalPatterns.filter(p => 
      !comparison.current.includes(p) && !comparison.minimal.includes(p)
    );
    
    if (missingCritical.length > 0) {
      recommendations.push({
        type: 'suggestion',
        message: `Consider adding these patterns: ${missingCritical.join(', ')}`
      });
    }
    
    // Display recommendations
    recommendations.forEach(rec => {
      const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : '💡';
      console.log(`${icon} ${rec.message}`);
    });
    
    return recommendations;
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Main function
  run() {
    console.log('🚀 Starting Minimal .vercelignore Analysis...');
    
    const minimalContent = this.generateMinimal();
    const comparison = this.compareIgnoreFiles();
    const minimalResults = this.simulateMinimalDeployment();
    const recommendations = this.generateRecommendations(comparison, minimalResults);
    
    // Save comparison report
    const report = {
      timestamp: new Date().toISOString(),
      comparison,
      minimalResults,
      recommendations,
      minimalIgnoreContent: minimalContent
    };
    
    fs.writeFileSync(this.comparisonReport, JSON.stringify(report, null, 2));
    console.log(`\n💾 Comparison report saved to: ${this.comparisonReport}`);
    
    console.log('\n✅ Minimal .vercelignore analysis complete!');
  }
}

// Run the generator
if (require.main === module) {
  const generator = new MinimalVercelIgnoreGenerator();
  generator.run();
}

module.exports = MinimalVercelIgnoreGenerator;