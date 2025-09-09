#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, chmodSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔧 Installing Git hooks for harambasic.de...\n');

// Check if we're in a git repository
try {
	execSync('git rev-parse --git-dir', { cwd: projectRoot, stdio: 'ignore' });
} catch (error) {
	console.error('❌ Error: Not in a Git repository');
	process.exit(1);
}

// Define hooks and their content
const hooks = {
	'pre-commit': {
		description: 'Pre-commit quality checks (format, lint, test, build)',
		content: `#!/bin/bash

# Pre-commit hook for harambasic.de
# Ensures all quality checks pass before allowing commits
# Mirrors GitHub Actions quality-gate workflow

set -e

echo "🔍 Running pre-commit quality checks..."

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "\${BLUE}[PRE-COMMIT]\${NC} $1"
}

print_success() {
    echo -e "\${GREEN}✅ $1\${NC}"
}

print_warning() {
    echo -e "\${YELLOW}⚠️  $1\${NC}"
}

print_error() {
    echo -e "\${RED}❌ $1\${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed or not in PATH"
    exit 1
fi

# Function to stage modified files
stage_modified_files() {
    local modified_files=$(git diff --name-only)
    if [ -n "$modified_files" ]; then
        print_warning "Auto-formatting/linting modified files, staging them..."
        git add $modified_files
        return 0
    fi
    return 1
}

print_status "Step 1/6: Running code formatting..."

# Run Prettier formatting
if npm run format; then
    print_success "Code formatting completed"
    stage_modified_files
else
    print_error "Code formatting failed"
    exit 1
fi

print_status "Step 2/6: Running linting with auto-fix..."

# Run ESLint with auto-fix
if npm run lint:fix; then
    print_success "Linting completed with auto-fixes applied"
    stage_modified_files
else
    print_error "Linting failed - please fix the issues manually"
    exit 1
fi

print_status "Step 3/6: Running final lint check..."

# Verify linting passes after fixes
if npm run lint; then
    print_success "Final lint check passed"
else
    print_error "Lint check failed even after auto-fixes"
    print_error "Please fix the remaining issues manually and try again"
    exit 1
fi

print_status "Step 4/6: Running type checking..."

# Run Svelte type checking
if npm run check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    print_error "Please fix type errors and try again"
    exit 1
fi

print_status "Step 5/6: Running tests..."

# Run unit tests
if npm run test; then
    print_success "All tests passed"
else
    print_error "Tests failed"
    print_error "Please fix failing tests and try again"
    exit 1
fi

print_status "Step 6/6: Verifying build..."

# Run build to ensure it works
if npm run build; then
    print_success "Build verification passed"
else
    print_error "Build failed"
    print_error "Please fix build errors and try again"
    exit 1
fi

print_success "All quality checks passed! 🎉"
print_status "Commit proceeding..."

exit 0`
	}
};

// Install hooks
const hooksDir = join(projectRoot, '.git', 'hooks');
let installed = 0;
let updated = 0;

for (const [hookName, hookConfig] of Object.entries(hooks)) {
	const hookPath = join(hooksDir, hookName);
	const exists = existsSync(hookPath);
	
	try {
		// Write hook file
		writeFileSync(hookPath, hookConfig.content);
		
		// Make executable
		chmodSync(hookPath, 0o755);
		
		if (exists) {
			console.log(`✅ Updated ${hookName} hook`);
			updated++;
		} else {
			console.log(`✅ Installed ${hookName} hook`);
			installed++;
		}
		
		console.log(`   Description: ${hookConfig.description}`);
	} catch (error) {
		console.error(`❌ Failed to install ${hookName} hook:`, error.message);
		process.exit(1);
	}
}

// Summary
console.log(`\\n🎉 Git hooks installation complete!`);
console.log(`   • Installed: ${installed} hook(s)`);
console.log(`   • Updated: ${updated} hook(s)`);

console.log('\\n📋 What the pre-commit hook does:');
console.log('   1. Runs code formatting (prettier)');
console.log('   2. Runs linting with auto-fix (eslint)');
console.log('   3. Verifies final lint check passes');
console.log('   4. Runs type checking (svelte-check)');
console.log('   5. Runs all tests (vitest)');
console.log('   6. Verifies build works');

console.log('\\n💡 Benefits:');
console.log('   • Prevents failed GitHub Action runs');
console.log('   • Auto-fixes formatting and linting issues');
console.log('   • Ensures quality before code reaches remote');
console.log('   • Saves CI/CD compute time and costs');

console.log('\\n🚀 Your commits will now automatically maintain code quality!');

console.log('\\n🔧 To disable temporarily: git commit --no-verify');
console.log('💡 To reinstall hooks: npm run install-hooks');