/**
 * Tests for template system functions
 * Testing pure functions with predictable template rendering
 */

import { describe, it, expect } from 'vitest';
import {
	basicPostTemplate,
	tutorialPostTemplate,
	projectTemplate,
	usesTemplate,
	getTemplate,
	getTemplatesForType,
	getDefaultTemplate,
	renderTemplate
} from './templates.js';

describe('Template Registry', () => {
	describe('getTemplate', () => {
		it('should return basic post template', () => {
			const template = getTemplate('basic-post');
			expect(template).toBeTruthy();
			expect(template.name).toBe('basic-post');
			expect(template.type).toBe('post');
		});

		it('should return tutorial post template', () => {
			const template = getTemplate('tutorial-post');
			expect(template).toBeTruthy();
			expect(template.name).toBe('tutorial-post');
			expect(template.type).toBe('post');
		});

		it('should return project template', () => {
			const template = getTemplate('basic-project');
			expect(template).toBeTruthy();
			expect(template.name).toBe('basic-project');
			expect(template.type).toBe('project');
		});

		it('should return uses template', () => {
			const template = getTemplate('basic-uses');
			expect(template).toBeTruthy();
			expect(template.name).toBe('basic-uses');
			expect(template.type).toBe('uses');
		});

		it('should return null for non-existent template', () => {
			const template = getTemplate('non-existent');
			expect(template).toBeNull();
		});
	});

	describe('getTemplatesForType', () => {
		it('should return post templates', () => {
			const templates = getTemplatesForType('post');
			expect(templates.length).toBeGreaterThan(0);
			expect(templates.every(t => t.type === 'post')).toBe(true);
		});

		it('should return project templates', () => {
			const templates = getTemplatesForType('project');
			expect(templates.length).toBeGreaterThan(0);
			expect(templates.every(t => t.type === 'project')).toBe(true);
		});

		it('should return uses templates', () => {
			const templates = getTemplatesForType('uses');
			expect(templates.length).toBeGreaterThan(0);
			expect(templates.every(t => t.type === 'uses')).toBe(true);
		});

		it('should return empty array for unknown type', () => {
			const templates = getTemplatesForType('unknown');
			expect(templates).toEqual([]);
		});
	});

	describe('getDefaultTemplate', () => {
		it('should return default post template', () => {
			const template = getDefaultTemplate('post');
			expect(template).toBeTruthy();
			expect(template.type).toBe('post');
			expect(template.name).toBe('basic-post');
		});

		it('should return default project template', () => {
			const template = getDefaultTemplate('project');
			expect(template).toBeTruthy();
			expect(template.type).toBe('project');
			expect(template.name).toBe('basic-project');
		});

		it('should return default uses template', () => {
			const template = getDefaultTemplate('uses');
			expect(template).toBeTruthy();
			expect(template.type).toBe('uses');
			expect(template.name).toBe('basic-uses');
		});

		it('should return null for unknown type', () => {
			const template = getDefaultTemplate('unknown');
			expect(template).toBeNull();
		});
	});
});

describe('Template Rendering', () => {
	const basicMetadata = {
		title: 'Test Title',
		description: 'Test description for the content.',
		tags: ['Test', 'Example'],
		publishDate: new Date('2024-01-01')
	};

	describe('renderTemplate', () => {
		it('should render basic post template', () => {
			const result = renderTemplate(basicPostTemplate, basicMetadata);
			
			expect(result).toContain('---');
			expect(result).toContain('title: Test Title');
			expect(result).toContain('description: Test description for the content.');
			expect(result).toContain('tags:');
			expect(result).toContain('- Test');
			expect(result).toContain('- Example');
			expect(result).toContain('published: 2024-01-01');
			expect(result).toContain('# Test Title');
		});

		it('should render project template', () => {
			const projectMetadata = {
				...basicMetadata,
				url: 'https://example.com',
				status: 'active',
				priority: 100,
				openSource: true
			};

			const result = renderTemplate(projectTemplate, projectMetadata);
			
			expect(result).toContain('url: https://example.com');
			expect(result).toContain('status: active');
			expect(result).toContain('prio: 100');
			expect(result).toContain('openSource: true');
			expect(result).toContain('## Contributing');
		});

		it('should render uses template', () => {
			const usesMetadata = {
				...basicMetadata,
				url: 'https://tool.example.com',
				status: 'active',
				openSource: true
			};

			const result = renderTemplate(usesTemplate, usesMetadata);
			
			expect(result).toContain('url: https://tool.example.com');
			expect(result).toContain('status: active');
			expect(result).toContain('openSource: true');
			expect(result).toContain('## What I Use It For');
		});

		it('should handle missing optional fields', () => {
			const minimalMetadata = {
				title: 'Minimal Title',
				description: 'Minimal description.'
			};

			const result = renderTemplate(basicPostTemplate, minimalMetadata);
			
			expect(result).toContain('title: Minimal Title');
			expect(result).toContain('description: Minimal description.');
			expect(result).toContain('tags: []');
		});

		it('should escape YAML strings properly', () => {
			const metadataWithSpecialChars = {
				title: 'Title: With Special "Characters"',
				description: 'Description with: special characters & symbols.'
			};

			const result = renderTemplate(basicPostTemplate, metadataWithSpecialChars);
			
			expect(result).toContain('"Title: With Special \\"Characters\\""');
			expect(result).toContain('"Description with: special characters & symbols."');
		});
	});
});

describe('Individual Templates', () => {
	const metadata = {
		title: 'Test Content',
		description: 'Test description',
		tags: ['Test'],
		publishDate: new Date('2024-01-01')
	};

	describe('basicPostTemplate', () => {
		it('should have correct structure', () => {
			expect(basicPostTemplate.name).toBe('basic-post');
			expect(basicPostTemplate.type).toBe('post');
			expect(basicPostTemplate.description).toBeTruthy();
			expect(typeof basicPostTemplate.frontmatterFn).toBe('function');
			expect(typeof basicPostTemplate.contentFn).toBe('function');
		});

		it('should generate correct frontmatter', () => {
			const frontmatter = basicPostTemplate.frontmatterFn(metadata);
			
			expect(frontmatter.title).toBe('Test Content');
			expect(frontmatter.description).toBe('Test description');
			expect(frontmatter.published).toBe('2024-01-01');
			expect(frontmatter.tldr).toBe('TBD');
			expect(frontmatter.discussion).toBe('TBD');
		});

		it('should generate content body', () => {
			const content = basicPostTemplate.contentFn(metadata);
			
			expect(content).toContain('# Test Content');
			expect(content).toContain('Test description');
			expect(content).toContain('## Introduction');
		});
	});

	describe('tutorialPostTemplate', () => {
		it('should have tutorial-specific sections', () => {
			const content = tutorialPostTemplate.contentFn(metadata);
			
			expect(content).toContain('## Prerequisites');
			expect(content).toContain('## What You\'ll Learn');
			expect(content).toContain('## Step 1:');
			expect(content).toContain('## Conclusion');
		});

		it('should handle custom tutorial metadata', () => {
			const tutorialMetadata = {
				...metadata,
				prerequisite1: 'Node.js installed',
				step1Title: 'Setup Environment',
				codeLanguage: 'javascript'
			};

			const content = tutorialPostTemplate.contentFn(tutorialMetadata);
			
			expect(content).toContain('Node.js installed');
			expect(content).toContain('Setup Environment');
			expect(content).toContain('```javascript');
		});
	});

	describe('projectTemplate', () => {
		it('should handle open source projects', () => {
			const projectMetadata = {
				...metadata,
				openSource: true,
				license: 'MIT'
			};

			const content = projectTemplate.contentFn(projectMetadata);
			
			expect(content).toContain('## Contributing');
			expect(content).toContain('MIT License');
		});

		it('should handle closed source projects', () => {
			const projectMetadata = {
				...metadata,
				openSource: false
			};

			const content = projectTemplate.contentFn(projectMetadata);
			
			expect(content).not.toContain('## Contributing');
		});
	});

	describe('usesTemplate', () => {
		it('should have uses-specific sections', () => {
			const content = usesTemplate.contentFn(metadata);
			
			expect(content).toContain('## What I Use It For');
			expect(content).toContain('## Why I Recommend It');
			expect(content).toContain('## Key Features');
			expect(content).toContain('## Alternatives');
		});
	});
});