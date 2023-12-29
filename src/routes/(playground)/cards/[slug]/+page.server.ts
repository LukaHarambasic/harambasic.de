import { createClient } from '@supabase/supabase-js'
import type { EntryGenerator, RouteParams } from './$types'
import { t } from './i18n'

const supabase = createClient(
  'https://xqlghnitokncvzvxoiyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGdobml0b2tuY3Z6dnhvaXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzQyMzYwNSwiZXhwIjoxOTk4OTk5NjA1fQ.QzoaOpgNPQF32zJl5c-Olx6ZEhw03M5mkbAA_zkBrT8'
)

interface Card {
  slug: string
  name: string
  content: string
  language: string
  imageUrl: string
}

async function fetchCards(): Promise<Card[]> {
  const { data, error } = await supabase.from('cards').select('*')
  if (error) {
    throw new Error(`error`)
  }
  if (!data) {
    throw new Error('No data: data')
  }
  return data.map(({ uuid, name, content, language, image_url }) => {
    return {
      slug: uuid,
      name,
      content,
      language,
      imageUrl: image_url
    }
  })
}

function getCardBySlug(slug: string, cards: Card[]): Card | undefined {
  return cards.find((card) => card!.slug === slug)
}

function getEntries(cards: Card[]): RouteParams[] {
  return cards.map(({ slug }) => ({ slug }))
}

export const load = async ({ params }) => {
  const cards = await fetchCards()
  const card = getCardBySlug(params.slug, cards)
  return {
    name: card!.name,
    language: card!.language,
    slug: card!.slug,
    content: card!.content,
    imageUrl: card!.imageUrl,
    greeting: t('greeting', card!.language, card!.name),
    farewell: t('farewell', card!.language),
    backDownload: t('backDownload', card!.language),
    fullTitle: t('title', card!.language, card!.name),
    description: t('description', card!.language),
    socialImg: card!.imageUrl,
    socialImgAlt: t('socialImgAlt', card!.language),
    frontTitle: t('frontTitle', card!.language, card!.name),
    frontBlink: t('frontBlink', card!.language),
    frontGenerated: t('frontGenerated', card!.language, card!.name),
    footerGenerated: t('footerGenerated', card!.language, card!.name),
    footerBy: t('footerBy', card!.language)
  }
}

export const entries: EntryGenerator = async () => {
  const cards = await fetchCards()
  return getEntries(cards)
}

export const prerender = true
