#!/usr/bin/env node

/**
 * Interactive CLI for content creation
 * Uses pure functions and functional composition
 * No classes or OOP patterns
 */

import readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { createPost, createProject, createUses } from '../../src/lib/content/creators.js';
import { getTemplatesForType } from '../../src/lib/content/templates.js';
import { generateSlug } from '../../src/lib/content/util.js';

const execAsync = promisify(exec);

/**
 * CLI configuration type
 * @typedef {Object} CLIConfig
 * @property {boolean} interactive - Whether to use interactive mode
 * @property {string} [type] - Content type if specified
 * @property {string} [title] - Title if specified
 * @property {string} [description] - Description if specified
 * @property {string[]} [tags] - Tags if specified
 * @property {string} [template] - Template name if specified
 * @property {boolean} [draft] - Whether to create as draft
 */

/**
 * Creates readline interface for user interaction
 * @returns {readline.Interface} Readline interface
 */
function createReadlineInterface() {
	return readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
}

/**
 * Promisified question function for readline
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's answer
 */
function askQuestion(rl, question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

/**
 * Prompts for content type selection
 * @param {readline.Interface} rl - Readline interface
 * @returns {Promise<string>} Selected content type
 */
async function promptContentType(rl) {
	console.log('\n📝 What type of content would you like to create?');
	console.log('1. Blog Post');
	console.log('2. Project');
	console.log('3. Uses Entry');
	
	const choice = await askQuestion(rl, '\nEnter your choice (1-3): ');
	
	switch (choice) {
		case '1':
		case 'post':
			return 'post';
		case '2':
		case 'project':
			return 'project';
		case '3':
		case 'uses':
			return 'uses';
		default:
			console.log('Invalid choice. Defaulting to blog post.');
			return 'post';
	}
}

/**
 * Prompts for template selection
 * @param {readline.Interface} rl - Readline interface
 * @param {string} contentType - Content type
 * @returns {Promise<string|null>} Selected template name or null for default
 */
async function promptTemplateSelection(rl, contentType) {
	const templates = getTemplatesForType(contentType);
	
	if (templates.length <= 1) {
		return null; // Use default template
	}
	
	console.log(`\n🎨 Available templates for ${contentType}:`);
	templates.forEach((template, index) => {
		console.log(`${index + 1}. ${template.name} - ${template.description}`);
	});
	console.log(`${templates.length + 1}. Use default template`);
	
	const choice = await askQuestion(rl, '\nEnter your choice: ');
	const choiceNum = parseInt(choice, 10);
	
	if (choiceNum >= 1 && choiceNum <= templates.length) {
		return templates[choiceNum - 1].name;
	}
	
	return null; // Use default template
}

/**
 * Prompts for basic metadata
 * @param {readline.Interface} rl - Readline interface
 * @returns {Promise<object>} Basic metadata object
 */
async function promptBasicMetadata(rl) {
	const title = await askQuestion(rl, '\n📖 Enter the title: ');
	if (title.length < 3) {
		console.log('Title must be at least 3 characters long.');
		return promptBasicMetadata(rl);
	}
	
	const description = await askQuestion(rl, '📄 Enter a description: ');
	if (description.length < 10) {
		console.log('Description must be at least 10 characters long.');
		return promptBasicMetadata(rl);
	}
	
	const tagsInput = await askQuestion(rl, '🏷️  Enter tags (comma-separated): ');
	const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(Boolean) : [];
	
	return { title, description, tags };
}

/**
 * Prompts for post-specific metadata
 * @param {readline.Interface} rl - Readline interface
 * @param {object} baseMetadata - Base metadata
 * @returns {Promise<object>} Complete post metadata
 */
async function promptPostMetadata(rl, baseMetadata) {
	const tldr = await askQuestion(rl, '💡 Enter TL;DR (optional): ');
	const discussion = await askQuestion(rl, '💬 Enter discussion URL (optional): ');
	const image = await askQuestion(rl, '🖼️  Enter image filename (optional, will default to TODO): ');
	
	return {
		...baseMetadata,
		tldr: tldr || undefined,
		discussion: discussion || undefined,
		image: image || undefined
	};
}

/**
 * Prompts for project-specific metadata
 * @param {readline.Interface} rl - Readline interface
 * @param {object} baseMetadata - Base metadata
 * @returns {Promise<object>} Complete project metadata
 */
async function promptProjectMetadata(rl, baseMetadata) {
	const url = await askQuestion(rl, '🌐 Enter project URL: ');
	const isOpenSourceInput = await askQuestion(rl, '📖 Is this open source? (y/n): ');
	const openSource = isOpenSourceInput.toLowerCase().startsWith('y');
	
	let priority = 100;
	const priorityInput = await askQuestion(rl, '⭐ Enter priority (1-1000, default 100): ');
	if (priorityInput && !isNaN(parseInt(priorityInput, 10))) {
		priority = parseInt(priorityInput, 10);
	}
	
	const status = await askQuestion(rl, '📊 Enter status (active/inactive, default active): ');
	
	return {
		...baseMetadata,
		url,
		openSource,
		priority,
		status: status || 'active',
		slug: generateSlug(baseMetadata.title)
	};
}

/**
 * Prompts for uses entry metadata
 * @param {readline.Interface} rl - Readline interface
 * @param {object} baseMetadata - Base metadata
 * @returns {Promise<object>} Complete uses entry metadata
 */
async function promptUsesMetadata(rl, baseMetadata) {
	const url = await askQuestion(rl, '🌐 Enter product/tool URL: ');
	
	const isOpenSourceInput = await askQuestion(rl, '📖 Is this open source? (y/n/unknown): ');
	let openSource = null;
	if (isOpenSourceInput.toLowerCase().startsWith('y')) {
		openSource = true;
	} else if (isOpenSourceInput.toLowerCase().startsWith('n')) {
		openSource = false;
	}
	
	const status = await askQuestion(rl, '📊 Enter status (active/inactive, default active): ');
	
	return {
		...baseMetadata,
		url,
		openSource,
		status: status || 'active',
		slug: generateSlug(baseMetadata.title)
	};
}

/**
 * Prompts for content-type specific metadata
 * @param {readline.Interface} rl - Readline interface
 * @param {string} contentType - Content type
 * @param {object} baseMetadata - Base metadata
 * @returns {Promise<object>} Complete metadata
 */
async function promptSpecificMetadata(rl, contentType, baseMetadata) {
	switch (contentType) {
		case 'post':
			return promptPostMetadata(rl, baseMetadata);
		case 'project':
			return promptProjectMetadata(rl, baseMetadata);
		case 'uses':
			return promptUsesMetadata(rl, baseMetadata);
		default:
			return baseMetadata;
	}
}

/**
 * Creates content using the appropriate creation function
 * @param {string} contentType - Content type
 * @param {object} metadata - Content metadata
 * @param {string} [templateName] - Template name
 * @returns {object} Creation result
 */
function createContentByType(contentType, metadata, templateName) {
	switch (contentType) {
		case 'post':
			return createPost(metadata, templateName);
		case 'project':
			return createProject(metadata);
		case 'uses':
			return createUses(metadata);
		default:
			return {
				success: false,
				filePath: '',
				errors: [`Unsupported content type: ${contentType}`]
			};
	}
}

/**
 * Offers to open the created file in an editor
 * @param {readline.Interface} rl - Readline interface
 * @param {string} filePath - Path to the created file
 */
async function offerToOpenInEditor(rl, filePath) {
	const shouldOpen = await askQuestion(rl, '\n📝 Would you like to open the file in your default editor? (y/n): ');
	
	if (shouldOpen.toLowerCase().startsWith('y')) {
		try {
			// Try to open with the default editor
			await execAsync(`open "${filePath}"`);
			console.log('✅ File opened in default editor.');
		} catch (error) {
			console.log('⚠️  Could not open file in editor. You can manually open:', filePath);
		}
	}
}

/**
 * Parses command line arguments into configuration
 * @param {string[]} args - Command line arguments
 * @returns {CLIConfig} Parsed configuration
 */
function parseArgs(args) {
	const config = {
		interactive: true
	};
	
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		
		switch (arg) {
			case '--type':
				config.type = args[i + 1];
				i++; // Skip next arg as it's the value
				break;
			case '--title':
				config.title = args[i + 1];
				i++;
				break;
			case '--description':
				config.description = args[i + 1];
				i++;
				break;
			case '--tags':
				config.tags = args[i + 1].split(',').map(tag => tag.trim());
				i++;
				break;
			case '--template':
				config.template = args[i + 1];
				i++;
				break;
			case '--no-interactive':
				config.interactive = false;
				break;
			case '--draft':
				config.draft = true;
				break;
			case '--help':
			case '-h':
				showHelp();
				process.exit(0);
				break;
			case '--list-templates':
				listTemplates();
				process.exit(0);
				break;
		}
	}
	
	return config;
}

/**
 * Shows help information
 */
function showHelp() {
	console.log(`
Usage: node scripts/content/cli.js [options]

Options:
  --type <type>           Content type (post, project, uses)
  --template <template>   Template name to use
  --title <title>         Content title
  --description <desc>    Content description
  --tags <tags>           Comma-separated tags
  --draft                 Create as draft
  --no-interactive        Skip interactive prompts
  --list-templates        List available templates
  --help, -h              Show this help message

Examples:
  node scripts/content/cli.js                    # Interactive mode
  node scripts/content/cli.js --type=post        # Create post interactively
  node scripts/content/cli.js --type=post --title="My New Post" --no-interactive
  node scripts/content/cli.js --list-templates   # Show available templates
	`);
}

/**
 * Lists all available templates
 */
function listTemplates() {
	const contentTypes = ['post', 'project', 'uses'];
	
	console.log('\n📋 Available Templates:\n');
	
	contentTypes.forEach(type => {
		const templates = getTemplatesForType(type);
		if (templates.length > 0) {
			console.log(`${type.toUpperCase()}:`);
			templates.forEach(template => {
				console.log(`  - ${template.name}: ${template.description}`);
			});
			console.log();
		}
	});
}

/**
 * Runs the interactive content creation process
 * @param {CLIConfig} config - CLI configuration
 */
async function runInteractiveCLI(config) {
	const rl = createReadlineInterface();
	
	try {
		console.log('🚀 Creating new content...\n');
		
		// Get content type
		const contentType = config.type || await promptContentType(rl);
		
		// Get template
		const templateName = config.template || await promptTemplateSelection(rl, contentType);
		
		// Get basic metadata
		let metadata;
		if (config.title && config.description) {
			metadata = {
				title: config.title,
				description: config.description,
				tags: config.tags || []
			};
		} else {
			metadata = await promptBasicMetadata(rl);
		}
		
		// Get specific metadata for content type
		metadata = await promptSpecificMetadata(rl, contentType, metadata);
		
		// Add draft flag if specified
		if (config.draft) {
			metadata.publishDate = new Date('2999-12-31');
		}
		
		console.log('\n⏳ Creating content...');
		
		// Create content
		const result = createContentByType(contentType, metadata, templateName);
		
		if (result.success) {
			console.log(`✅ Content created successfully!`);
			console.log(`📁 File: ${result.filePath}`);
			
			if (result.imageDirPath) {
				console.log(`🖼️  Image directory: ${result.imageDirPath}`);
			}
			
			// Offer to open in editor
			await offerToOpenInEditor(rl, result.filePath);
		} else {
			console.log('❌ Failed to create content:');
			result.errors?.forEach(error => console.log(`   - ${error}`));
		}
		
	} catch (error) {
		console.error('❌ An error occurred:', error.message);
	} finally {
		rl.close();
	}
}

/**
 * Runs the non-interactive content creation
 * @param {CLIConfig} config - CLI configuration
 */
function runNonInteractiveCLI(config) {
	if (!config.type || !config.title || !config.description) {
		console.error('❌ In non-interactive mode, --type, --title, and --description are required.');
		process.exit(1);
	}
	
	const metadata = {
		title: config.title,
		description: config.description,
		tags: config.tags || [],
		publishDate: config.draft ? new Date('2999-12-31') : undefined
	};
	
	console.log('⏳ Creating content...');
	
	const result = createContentByType(config.type, metadata, config.template);
	
	if (result.success) {
		console.log(`✅ Content created: ${result.filePath}`);
		if (result.imageDirPath) {
			console.log(`🖼️  Image directory: ${result.imageDirPath}`);
		}
	} else {
		console.log('❌ Failed to create content:');
		result.errors?.forEach(error => console.log(`   - ${error}`));
		process.exit(1);
	}
}

/**
 * Main function - entry point for the CLI
 */
async function main() {
	const args = process.argv.slice(2);
	const config = parseArgs(args);
	
	if (config.interactive) {
		await runInteractiveCLI(config);
	} else {
		runNonInteractiveCLI(config);
	}
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(error => {
		console.error('❌ Fatal error:', error.message);
		process.exit(1);
	});
}

export { main, parseArgs, runInteractiveCLI, runNonInteractiveCLI };