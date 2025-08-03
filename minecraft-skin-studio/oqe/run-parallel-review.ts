#!/usr/bin/env node
/**
 * Run Parallel Agent Review
 * Executes all agents concurrently to review the project
 */

import { runParallelReview } from './agents/parallel-review';
import * as path from 'path';

const projectPath = path.resolve(__dirname, '../../');

console.log('🚀 Starting Parallel Agent Review Pipeline');
console.log(`📁 Project Path: ${projectPath}`);

runParallelReview(projectPath).then(reviews => {
  console.log('\n✅ Parallel review completed successfully');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Review failed:', error);
  process.exit(1);
});