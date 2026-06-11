import { describe, it, expect } from 'vitest';
import { experienceEntryToFullHtml } from './experienceEntry';
import type { ExperienceEntry } from '$lib/types/experienceEntry';

function createMockExperienceEntry(overrides: Partial<ExperienceEntry> = {}): ExperienceEntry {
	return {
		type: 'experience',
		title: 'Test Company',
		description: 'A test experience entry',
		image: '',
		tags: [],
		published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
		updated: { raw: new Date('2024-01-01'), display: '2024-01-01' },
		slug: 'test-company',
		relativePath: '/experience/test-company',
		fullPath: 'https://harambasic.de/experience/test-company',
		location: 'Berlin',
		positions: [
			{
				title: 'Senior Engineer',
				startDate: '2022-01-01',
				endDate: null,
				content: '<p>Responsibilities and achievements.</p>'
			}
		],
		html: '',
		...overrides
	};
}

describe('experienceEntryToFullHtml', () => {
	it('should include position sections with title, dates, and content', () => {
		const entry = createMockExperienceEntry();
		const html = experienceEntryToFullHtml(entry);
		expect(html).toContain('<section class="position-section">');
		expect(html).toContain('<h2>Senior Engineer</h2>');
		expect(html).toContain('Jan 2022');
		expect(html).toContain('Present');
		expect(html).toContain('<div class="position-content">');
		expect(html).toContain('<p>Responsibilities and achievements.</p>');
	});

	it('should include company html when present', () => {
		const entry = createMockExperienceEntry({
			html: '<p>Company overview.</p>'
		});
		const html = experienceEntryToFullHtml(entry);
		expect(html).toContain('<div class="content">');
		expect(html).toContain('<p>Company overview.</p>');
	});

	it('should order positions by date (newest first)', () => {
		const entry = createMockExperienceEntry({
			positions: [
				{
					title: 'Junior',
					startDate: '2020-01-01',
					endDate: '2021-12-31',
					content: '<p>First.</p>'
				},
				{
					title: 'Senior',
					startDate: '2022-01-01',
					endDate: null,
					content: '<p>Second.</p>'
				}
			]
		});
		const html = experienceEntryToFullHtml(entry);
		const seniorIndex = html.indexOf('Senior');
		const juniorIndex = html.indexOf('Junior');
		expect(seniorIndex).toBeGreaterThanOrEqual(0);
		expect(juniorIndex).toBeGreaterThanOrEqual(0);
		expect(seniorIndex).toBeLessThan(juniorIndex);
	});

	it('should escape HTML in position title and dates', () => {
		const entry = createMockExperienceEntry({
			positions: [
				{
					title: 'Role <script>alert(1)</script>',
					startDate: '2022-01-01',
					endDate: '2023-12-31',
					content: '<p>Safe.</p>'
				}
			]
		});
		const html = experienceEntryToFullHtml(entry);
		expect(html).not.toContain('<script>');
		expect(html).toContain('&lt;script&gt;');
	});

	it('should return only company html when no positions', () => {
		const entry = createMockExperienceEntry({
			positions: [],
			html: '<p>Only company.</p>'
		});
		const html = experienceEntryToFullHtml(entry);
		expect(html).toBe('<div class="content"><p>Only company.</p></div>');
	});

	it('should return empty string when no positions and no company html', () => {
		const entry = createMockExperienceEntry({ positions: [], html: '' });
		const html = experienceEntryToFullHtml(entry);
		expect(html).toBe('');
	});
});
