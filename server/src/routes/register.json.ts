import mongo from '$lib/mongo';
import { UserAuthRequest } from '$lib/user/userBackend';
import { logger } from '$lib/logger';

export let post = async (req) => {
	let body = req.body;
	let db = await mongo.db('auth');
	let user = new UserAuthRequest(body as UserAuthRequest);

	logger.info(`creating user=${user.email}`);
	await user.create(db);
	return {
		status: 204
	};
};
