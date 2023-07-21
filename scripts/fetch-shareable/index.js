import { join } from 'path'
import * as fs from 'fs/promises'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xqlghnitokncvzvxoiyq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGdobml0b2tuY3Z6dnhvaXlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzQyMzYwNSwiZXhwIjoxOTk4OTk5NjA1fQ.QzoaOpgNPQF32zJl5c-Olx6ZEhw03M5mkbAA_zkBrT8'
)

const { data: shareables, error } = await supabase.from('record').select('*').eq('releasable', true)

const saveTo = join('..', '..', 'src', 'content', 'shareables')
shareables.forEach((shareable) => {
  // TODO check if file already exists and if so skip
  // TODO go over dates, maybe adjsut table and also generate dates in same format as others
  const { title, description, comment, category, url, updated, created_at } = shareable
  const content = `---
title: "${title}"
description: "${description.replace('"', "'")}"
tags: 
  - "${category}"
url: ${url}
comment: "${comment?.replaceAll('"', "'")}"
updated: "${created_at}"
published: "${created_at}"
---
`
  fs.writeFile(join(saveTo, `${getSlug(title)}.md`), content, 'utf8')
})

function getSlug(str) {
  if (!str) return ''
  const slug = str
    .trim()
    .toLowerCase()
    // remove all chars which aren't characters, numbers or spaces
    .replace(/[^a-zA-Z0-9\s]+/g, '')
    // replace all spaces with dashes
    .replace(/\s+/g, '-')
  return slug
}
