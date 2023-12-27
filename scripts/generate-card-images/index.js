import OpenAI from "openai"
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

async function _fetchCards() {
    const { data, error } = await supabase.from('cards').select('*')
    if (error) {
        throw new Error(`error`)
    }
    if (!data) {
        throw new Error('No data: ', data)
    }
    return data.map(({uuid, name, content, language}) => {
        return {
            uuid,
            name,
            content,
            language,
        }
    })
}

async function _saveImage(imageUrl, uuid) {
    await supabase.from('cards').update({imageUrl}).eq('uuid', uuid)
}

async function _generateImage(name) {
    const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `abstract layered christmas themed with light refracting , very cool subtle minimal christmas illustration, christmas red  with subtle highlights. each image is unique for a user, use their name in some way to make it more personal, it doesnt has to be integrated directly: ${name}`,
        n: 1,
        size: "1024x1024",
    })
    return image.data[0].url
}

async function main() {
    const cards = await _fetchCards()
    cards.forEach(async (card) => {
        const imageUrl = await _generateImage(card.name)
        await _saveImage(imageUrl, card.uuid)
    })
}

main()