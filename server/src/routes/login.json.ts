import mongo from '$lib/mongo';
import { UserAuthRequest } from '$lib/user/userBackend';
import { logger } from '$lib/logger';

export let put = async (req) => {
	let body = req.body;
	let db = await mongo.db('auth');
	let user = new UserAuthRequest(body as UserAuthRequest);
	let auth = await user.authenticate(db);

	logger.info(`authenticating user=${user.email} authenticated=${auth}`);
	let jwt = await UserAuthRequest.getJWT(db, user.email);
	return {
		status: auth ? 200 : 401,
		body: auth ? jwt : undefined
	};
};
