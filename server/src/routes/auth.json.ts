import mongo from '$lib/mongo';
import { User, UserAuthRequest } from '$lib/user/userBackend';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';

export let get = async (req) => {
	let service = req.query.get('service');
	let token = req.query.get('token');
	let db = await mongo.db('auth');

	logger.debug(token);
	logger.info(`authenticating user for service=${service}`);
	service = await Service.getSingle(db, service);
	let request = service.requests.find((r) => r.token === token);
	logger.info('requests', { request });
	if (!request)
		return {
			status: 403,
			body: 'no request found'
		};
	return {
		status: 200,
		body: { acl: request.acl }
	};
};

export let post = async (req) => {
	let db = await mongo.db('auth');
	let body = req.body;
	logger.info(`requesting auth for service=${body.service}`);
	let service = await Service.getSingle(db, body.service);
	if (!service.auth(body)) {
		logger.info(`hash did not match`);
		return {
			status: 401
		};
	} else {
		let request = service.requests.find((req) => req.token === body.token);
		if (!request) {
			logger.info(`request does not exist on the service`, { service, token: body.token });
			return {
				status: 400
			};
		}
		let user = await User.get(db, request.email);
		if (!user) {
			logger.warn(`the user no longer exists`);
			return {
				status: 400
			};
		}
		return {
			status: 200,
			body: await UserAuthRequest.getJWT(db, request.email, request.acl)
		};
	}
};
