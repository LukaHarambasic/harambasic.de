import { describe, it, expect } from 'vitest';
import { workEntryToFullHtml } from './workEntry';
import type { WorkEntry } from '$lib/types/workEntry';

function createMockWorkEntry(overrides: Partial<WorkEntry> = {}): WorkEntry {
	return {
		type: 'work',
		title: 'Test Company',
		description: 'A test work entry',
		image: '',
		tags: [],
		published: { raw: new Date('2024-01-01'), display: '2024-01-01' },
		updated: { raw: new Date('2024-01-01'), display: '2024-01-01' },
		slug: 'test-company',
		relativePath: '/work/test-company',
		fullPath: 'https://harambasic.de/work/test-company',
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

describe('workEntryToFullHtml', () => {
	it('should include position sections with title, dates, and content', () => {
		const entry = createMockWorkEntry();
		const html = workEntryToFullHtml(entry);
		expect(html).toContain('<section class="position-section">');
		expect(html).toContain('<h2>Senior Engineer</h2>');
		expect(html).toContain('Jan 2022');
		expect(html).toContain('Present');
		expect(html).toContain('<div class="position-content">');
		expect(html).toContain('<p>Responsibilities and achievements.</p>');
	});

	it('should include company html when present', () => {
		const entry = createMockWorkEntry({
			html: '<p>Company overview.</p>'
		});
		const html = workEntryToFullHtml(entry);
		expect(html).toContain('<div class="content">');
		expect(html).toContain('<p>Company overview.</p>');
	});

	it('should order positions by date (newest first)', () => {
		const entry = createMockWorkEntry({
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
		const html = workEntryToFullHtml(entry);
		const seniorIndex = html.indexOf('Senior');
		const juniorIndex = html.indexOf('Junior');
		expect(seniorIndex).toBeGreaterThanOrEqual(0);
		expect(juniorIndex).toBeGreaterThanOrEqual(0);
		expect(seniorIndex).toBeLessThan(juniorIndex);
	});

	it('should escape HTML in position title and dates', () => {
		const entry = createMockWorkEntry({
			positions: [
				{
					title: 'Role <script>alert(1)</script>',
					startDate: '2022-01-01',
					endDate: '2023-12-31',
					content: '<p>Safe.</p>'
				}
			]
		});
		const html = workEntryToFullHtml(entry);
		expect(html).not.toContain('<script>');
		expect(html).toContain('&lt;script&gt;');
	});

	it('should return only company html when no positions', () => {
		const entry = createMockWorkEntry({
			positions: [],
			html: '<p>Only company.</p>'
		});
		const html = workEntryToFullHtml(entry);
		expect(html).toBe('<div class="content"><p>Only company.</p></div>');
	});

	it('should return empty string when no positions and no company html', () => {
		const entry = createMockWorkEntry({ positions: [], html: '' });
		const html = workEntryToFullHtml(entry);
		expect(html).toBe('');
	});
});
