#!/usr/bin/env node

/**
 * Project Structure Verification Script
 * Run this to verify all project files are created correctly
 */

const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// All expected files
const expectedFiles = {
  root: [
    'README.md',
    'QUICK_START.md',
    '.gitignore',
    'backend/package.json',
    'backend/.env.example',
    'backend/README.md',
    'backend/src/index.js',
    'backend/src/routes/planRoutes.js',
    'backend/src/controllers/planController.js',
    'backend/src/services/planService.js',
    'backend/src/services/llmService.js',
    'backend/src/middleware/errorHandler.js',
    'backend/src/middleware/validation.js',
    'backend/src/utils/taskParser.js',
    'frontend/package.json',
    'frontend/.env.example',
    'frontend/README.md',
    'frontend/src/App.js',
    'frontend/src/App.css',
    'frontend/src/index.js',
    'frontend/src/index.css',
    'frontend/src/components/GoalInput.js',
    'frontend/src/components/GoalInput.css',
    'frontend/src/components/TaskPlan.js',
    'frontend/src/components/TaskPlan.css',
    'frontend/src/services/apiService.js',
    'frontend/public/index.html'
  ]
};

console.log('\n📋 Smart Task Planner - Project Verification\n');
console.log('=' .repeat(50));

let totalFiles = 0;
let foundFiles = 0;
let missingFiles = [];

expectedFiles.root.forEach(file => {
  totalFiles++;
  const filePath = path.join(projectRoot, file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    foundFiles++;
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${foundFiles}/${totalFiles} files created\n`);

if (missingFiles.length === 0) {
  console.log('✨ All files created successfully!\n');
  console.log('🚀 Next Steps:');
  console.log('   1. cd backend && npm install');
  console.log('   2. cd ../frontend && npm install');
  console.log('   3. Configure .env files with API keys');
  console.log('   4. Run: npm run dev (in backend)');
  console.log('   5. Run: npm start (in frontend)\n');
} else {
  console.log(`⚠️  Missing ${missingFiles.length} files:`);
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log();
}

console.log('=' .repeat(50) + '\n');
