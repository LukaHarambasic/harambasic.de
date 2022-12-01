import Axios from 'axios'

export async function requestBookmarks() {
    // TODO get form env
    const AIRTABLE_API_KEY = 'keyfsz1s90ZOkjmwL'
    const BASE_ID = 'appRJTFR1tt8TgVZs';
    const TABLE = 'Main';
    const requestUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;
    const config = {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    };
    const {
        data: { records },
    } = await Axios.get(requestUrl, config);
    return records;
}