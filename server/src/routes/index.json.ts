import mongo from '$lib/mongo';
import { User } from '$lib/user/userBackend';
import { logger } from '$lib/logger';

export let get = async (req) => {
	let db = await mongo.db('auth');
	let users = await User.getAll(db);

	if (!req.locals.authenticated) {
		logger.debug(`not authenticated`);
		return {
			status: 401
		};
	}
	logger.info(`fetching all users`);
	return {
		status: 200,
		body: users
	};
};
