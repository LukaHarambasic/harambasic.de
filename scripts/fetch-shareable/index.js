import { join } from 'path'
import * as fs from 'fs/promises'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
)

const { data: shareables } = await supabase
  .from('record')
  .select('*')
  .eq('releasable', true)

const saveTo = join('..', '..', 'src', 'content', 'shareables')
shareables.forEach((shareable) => {
  // TODO check if file already exists and if so skip
  // TODO go over dates, maybe adjsut table and also generate dates in same format as others
  const { title, description, comment, category, url, created_at } = shareable
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
