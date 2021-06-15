import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import keys from '$lib/keys';

export let get = async (req) => {
	logger.debug(`returning public key`);
	let db = await mongo.db('auth');
	let key = await keys.getKeys(db);
	return {
		status: 200,
		body: key.publicKey
	};
};
