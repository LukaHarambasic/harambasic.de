import { createClient } from '@supabase/supabase-js'
import type { EntryGenerator, RouteParams } from './$types';

const supabase = createClient(
  'https://xqlghnitokncvzvxoiyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGdobml0b2tuY3Z6dnhvaXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzQyMzYwNSwiZXhwIjoxOTk4OTk5NjA1fQ.QzoaOpgNPQF32zJl5c-Olx6ZEhw03M5mkbAA_zkBrT8'
)

interface Card {
    slug: string,
    name: string,
    content: string,
    language: string,
}

async function fetchCards(): Promise<Card[]> {
    const { data, error } = await supabase.from('cards').select('*')
    if (error) {
        throw new Error(`error`)
    }
    if (!data) {
        throw new Error('No data: data')
    }
    return data.map(({uuid, name, content, language}) => {
        return {
            slug: uuid,
            name,
            content,
            language,
        }
    })
}

function getCardBySlug(slug: string, cards: Card[]): Card | undefined {
    return cards.find((card) => card.slug === slug)
}

function getEntries(cards: Card[]): RouteParams[] {
    return cards.map(({slug}) => ({ slug }))
}

export const load = async ({params}) => {
    const cards = await fetchCards()
    return {
        card: getCardBySlug(params.slug, cards)
    }
}

export const entries: EntryGenerator = async () => {
    const cards = await fetchCards()
	return getEntries(cards)
}

export const prerender = true