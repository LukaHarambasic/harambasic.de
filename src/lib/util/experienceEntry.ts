import type { ExperienceEntry } from '$lib/types/experienceEntry';
import { formatDateDisplay, sortPositionsByDate } from './helper';

/**
 * Build full HTML content for an experience entry (company html + positions with title, dates, content).
 * Mirrors the structure rendered on the experience entry page for RSS content:encoded.
 */
export function experienceEntryToFullHtml(entry: ExperienceEntry): string {
	const sorted = sortPositionsByDate(entry.positions);
	const positionSections = sorted
		.map(
			(pos) =>
				`<section class="position-section"><h2>${escapeHtml(pos.title)}</h2><p class="position-dates">${escapeHtml(
					formatDateDisplay(pos.startDate)
				)} – ${pos.endDate ? escapeHtml(formatDateDisplay(pos.endDate)) : 'Present'}</p><div class="position-content">${pos.content}</div></section>`
		)
		.join('');
	const companyHtml = entry.html ? `<div class="content">${entry.html}</div>` : '';
	return positionSections + companyHtml;
}

function escapeHtml(unsafe: string): string {
	return unsafe
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}
