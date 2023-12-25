import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xqlghnitokncvzvxoiyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGdobml0b2tuY3Z6dnhvaXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzQyMzYwNSwiZXhwIjoxOTk4OTk5NjA1fQ.QzoaOpgNPQF32zJl5c-Olx6ZEhw03M5mkbAA_zkBrT8'
)

export interface Card {
    name: string,
    content: string,
    language: string,
}

export const prerender = true

async function fetchCard(slug: string): Promise<Card> {
    const { data, error } = await supabase.from('cards').select('*').eq('uuid', slug)
    if (error) {
        throw new Error(`error`)
    }
    if (!data) {
        throw new Error('No data: data')
    }
    return {
        name: data[0].name,
        content: data[0].content,
        language: data[0].language,
    }
}

export const load = async ({params}) => ({  
    card: await fetchCard(params.slug)
})