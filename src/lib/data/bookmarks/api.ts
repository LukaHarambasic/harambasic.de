import Axios from 'axios';

// TODO change to fetch or whatelse sveltekit recommends or leave it like this
export async function request() {
	// TODO get from env and change key afterwards
	const AIRTABLE_API_KEY = 'keyfsz1s90ZOkjmwL';
	const BASE_ID = 'appRJTFR1tt8TgVZs';
	const TABLE = 'Main';
	const requestUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;
	const config = {
		headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
	};
	const {
		data: { records }
	} = await Axios.get(requestUrl, config);
	return records;
}
