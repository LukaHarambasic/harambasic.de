/**
 * Template system using pure functions and composition
 * No classes or OOP - just data transformation functions
 */

import { formatContentDate, normalizeTags, escapeYamlString } from './util.js';

/**
 * Template data structure (using type alias instead of interface)
 * @typedef {Object} ContentTemplate
 * @property {string} name - Template name
 * @property {string} type - Content type (post, project, uses)
 * @property {string} description - Template description
 * @property {function} frontmatterFn - Function that generates frontmatter
 * @property {function} contentFn - Function that generates content body
 */

/**
 * Base frontmatter generator with common fields
 * @param {object} metadata - Content metadata
 * @returns {object} Base frontmatter object
 */
function createBaseFrontmatter(metadata) {
	const publishDate = formatContentDate(metadata.publishDate);
	const updateDate = formatContentDate(metadata.updateDate || metadata.publishDate);
	
	return {
		title: escapeYamlString(metadata.title),
		description: escapeYamlString(metadata.description),
		published: publishDate,
		updated: updateDate,
		tags: normalizeTags(metadata.tags || [])
	};
}

/**
 * Converts frontmatter object to YAML string
 * @param {object} frontmatter - Frontmatter object
 * @returns {string} YAML frontmatter string
 */
function serializeFrontmatter(frontmatter) {
	const lines = ['---'];
	
	Object.entries(frontmatter).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			if (value.length === 0) {
				lines.push(`${key}: []`);
			} else {
				lines.push(`${key}:`);
				value.forEach(item => {
					lines.push(`  - ${escapeYamlString(item)}`);
				});
			}
		} else if (typeof value === 'object' && value !== null) {
			lines.push(`${key}:`);
			Object.entries(value).forEach(([subKey, subValue]) => {
				lines.push(`  ${subKey}: ${escapeYamlString(subValue)}`);
			});
		} else {
			lines.push(`${key}: ${escapeYamlString(value)}`);
		}
	});
	
	lines.push('---');
	return lines.join('\n');
}

/**
 * Template for basic blog posts
 */
export const basicPostTemplate = {
	name: 'basic-post',
	type: 'post',
	description: 'Basic blog post template',
	
	frontmatterFn: (metadata) => ({
		...createBaseFrontmatter(metadata),
		image: metadata.image || 'TODO',
		tldr: escapeYamlString(metadata.tldr || 'TBD'),
		discussion: escapeYamlString(metadata.discussion || 'TBD')
	}),
	
	contentFn: (metadata) => `
# ${metadata.title}

${metadata.description}

## Introduction

${metadata.introText || 'Add your introduction here...'}

## Main Content

${metadata.mainContent || 'Add your main content here...'}

## Conclusion

${metadata.conclusion || 'Add your conclusion here...'}
`.trim()
};

/**
 * Template for tutorial posts
 */
export const tutorialPostTemplate = {
	name: 'tutorial-post',
	type: 'post',
	description: 'Tutorial blog post with structured sections',
	
	frontmatterFn: (metadata) => ({
		...createBaseFrontmatter(metadata),
		image: metadata.image || 'TODO',
		tldr: escapeYamlString(metadata.tldr || `Learn ${metadata.title.toLowerCase()} step by step`),
		discussion: escapeYamlString(metadata.discussion || 'TBD')
	}),
	
	contentFn: (metadata) => `
# ${metadata.title}

${metadata.description}

## Prerequisites

Before starting this tutorial, you should have:

- [ ] ${metadata.prerequisite1 || 'Basic knowledge of the topic'}
- [ ] ${metadata.prerequisite2 || 'Required tools installed'}
- [ ] ${metadata.prerequisite3 || 'Access to necessary resources'}

## What You'll Learn

In this tutorial, you will learn:

1. ${metadata.objective1 || 'Main concept or skill'}
2. ${metadata.objective2 || 'Secondary concept or skill'}
3. ${metadata.objective3 || 'Best practices and tips'}

## Step 1: ${metadata.step1Title || 'Getting Started'}

${metadata.step1Description || 'Describe the first step here...'}

\`\`\`${metadata.codeLanguage || 'bash'}
# Add your code example here
\`\`\`

## Step 2: ${metadata.step2Title || 'Main Implementation'}

${metadata.step2Description || 'Describe the main implementation step here...'}

## Step 3: ${metadata.step3Title || 'Testing and Validation'}

${metadata.step3Description || 'Describe how to test and validate the implementation...'}

## Conclusion

In this tutorial, we covered:

- ${metadata.summary1 || 'Key concept learned'}
- ${metadata.summary2 || 'Implementation approach'}
- ${metadata.summary3 || 'Best practices'}

## Next Steps

Now that you've completed this tutorial, you might want to:

- [ ] ${metadata.nextStep1 || 'Apply this to your own project'}
- [ ] ${metadata.nextStep2 || 'Explore advanced topics'}
- [ ] ${metadata.nextStep3 || 'Check out related resources'}
`.trim()
};

/**
 * Template for project entries
 */
export const projectTemplate = {
	name: 'basic-project',
	type: 'project',
	description: 'Basic project template',
	
	frontmatterFn: (metadata) => ({
		...createBaseFrontmatter(metadata),
		image: metadata.image || `${metadata.slug || 'project'}.png`,
		imageAlt: escapeYamlString(metadata.imageAlt || `Screenshot of ${metadata.title}`),
		status: metadata.status || 'active',
		url: metadata.url || '',
		openSource: metadata.openSource === true,
		prio: metadata.priority || 100
	}),
	
	contentFn: (metadata) => `
# ${metadata.title}

${metadata.description}

## Overview

${metadata.overview || `${metadata.title} is a project that...`}

## Features

- ✨ ${metadata.feature1 || 'Key feature 1'}
- 🚀 ${metadata.feature2 || 'Key feature 2'}
- 🎯 ${metadata.feature3 || 'Key feature 3'}

## Technology Stack

- **Frontend**: ${metadata.frontendTech || 'Technology used'}
- **Backend**: ${metadata.backendTech || 'Technology used'}
- **Database**: ${metadata.databaseTech || 'Database used'}
- **Deployment**: ${metadata.deploymentPlatform || 'Platform used'}

## Key Challenges

${metadata.challenges || 'Describe the main challenges faced during development...'}

## Lessons Learned

${metadata.lessonsLearned || 'Share key insights and lessons from this project...'}

${metadata.openSource ? `## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## License

This project is licensed under the ${metadata.license || 'MIT'} License.` : ''}

## Links

- 🌐 [Live Demo](${metadata.url || '#'})${metadata.githubUrl ? `
- 📱 [GitHub Repository](${metadata.githubUrl})` : ''}${metadata.documentationUrl ? `
- 📚 [Documentation](${metadata.documentationUrl})` : ''}
`.trim()
};

/**
 * Template for uses entries
 */
export const usesTemplate = {
	name: 'basic-uses',
	type: 'uses',
	description: 'Basic uses entry template',
	
	frontmatterFn: (metadata) => ({
		...createBaseFrontmatter(metadata),
		image: metadata.image || `${metadata.slug || 'tool'}.svg`,
		status: metadata.status || 'active',
		url: metadata.url || '',
		openSource: metadata.openSource || null
	}),
	
	contentFn: (metadata) => `
# ${metadata.title}

${metadata.description}

## What I Use It For

${metadata.primaryUseCase || `I use ${metadata.title} for...`}

## Why I Recommend It

${metadata.recommendation || `${metadata.title} stands out because...`}

## Key Features

- 🎯 ${metadata.feature1 || 'Key feature that matters to me'}
- ⚡ ${metadata.feature2 || 'Performance or efficiency benefit'}
- 🔧 ${metadata.feature3 || 'Usability or workflow advantage'}

## Pricing

${metadata.pricing || 'Free / Paid / Subscription - describe the pricing model'}

## Alternatives

I've also tried:

- **${metadata.alternative1 || 'Alternative tool'}** - ${metadata.alternative1Opinion || 'Brief comparison'}
- **${metadata.alternative2 || 'Another alternative'}** - ${metadata.alternative2Opinion || 'Why I chose this over that'}

## Bottom Line

${metadata.bottomLine || `${metadata.title} is excellent for... I recommend it if you...`}

## Links

- 🌐 [Official Website](${metadata.url || '#'})${metadata.reviewUrl ? `
- 📝 [Detailed Review](${metadata.reviewUrl})` : ''}${metadata.tutorialUrl ? `
- 🎓 [How I Use It](${metadata.tutorialUrl})` : ''}
`.trim()
};

/**
 * Registry of all available templates
 */
export const templateRegistry = new Map([
	[basicPostTemplate.name, basicPostTemplate],
	[tutorialPostTemplate.name, tutorialPostTemplate],
	[projectTemplate.name, projectTemplate],
	[usesTemplate.name, usesTemplate]
]);

/**
 * Gets template by name
 * @param {string} templateName - Name of the template
 * @returns {ContentTemplate|null} Template or null if not found
 */
export function getTemplate(templateName) {
	return templateRegistry.get(templateName) || null;
}

/**
 * Gets all templates for a specific content type
 * @param {string} contentType - Content type to filter by
 * @returns {ContentTemplate[]} Array of matching templates
 */
export function getTemplatesForType(contentType) {
	return Array.from(templateRegistry.values()).filter(
		template => template.type === contentType
	);
}

/**
 * Gets the default template for a content type
 * @param {string} contentType - Content type
 * @returns {ContentTemplate|null} Default template or null
 */
export function getDefaultTemplate(contentType) {
	const templates = getTemplatesForType(contentType);
	
	// Return the first template that starts with "basic-" or the first one available
	return templates.find(t => t.name.startsWith('basic-')) || templates[0] || null;
}

/**
 * Renders a template with provided metadata
 * @param {ContentTemplate} template - Template to render
 * @param {object} metadata - Metadata to populate the template
 * @returns {string} Rendered content
 */
export function renderTemplate(template, metadata) {
	const frontmatter = template.frontmatterFn(metadata);
	const content = template.contentFn(metadata);
	const yamlFrontmatter = serializeFrontmatter(frontmatter);
	
	return `${yamlFrontmatter}\n\n${content}`;
}