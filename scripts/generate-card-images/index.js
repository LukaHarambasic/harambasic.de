import fetch from 'node-fetch';
import OpenAI from "openai"
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

async function _fetchCards() {
    const { data, error } = await supabase.from('cards').select('*').is('image_url', null);
    console.log('Cards fetched: ', data.length)
    if (error) throw new Error(`error`)
    if (!data) throw new Error('No data: ', data)
    return data.map(({uuid, name, content, language}) => {
        return {
            uuid,
            name,
            content,
            language,
        }
    })
}

// TODO types could be added to the table and based on that a different prompt can be selected, e.g. if the type is christmas the picture below gets generated
// ok than also the text needs to be changed, but maybe as a type in the translation file as well?
async function _generateImage(name) {
    const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `abstract layered christmas themed with light refracting , very cool subtle minimal christmas illustration, christmas red  with subtle highlights. each image is unique for a user, use their name in some way to make it more personal, it doesnt has to be integrated directly: ${name}`,
        n: 1,
        size: "1024x1024",
    })
    return image.data[0].url
}

async function _fetchImage(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    return await response.buffer();
}

async function _saveImage(blob, uuid) {
    const { data, error } = await supabase.storage.from('cards').upload(`${uuid}.jpg`, blob);
    if (error) throw new Error('Failed to upload image: ', error);
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`
    await supabase.from('cards').update({image_url: imageUrl}).eq('uuid', uuid);
}

async function main() {
    const cards = await _fetchCards()
    cards.forEach(async (card) => {
        const imageUrl = await _generateImage(card.name)
        const blob = await _fetchImage(imageUrl)
        await _saveImage(blob, card.uuid)
    })
}

main()