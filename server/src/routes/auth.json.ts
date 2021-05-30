import mongo from '$lib/mongo';
import { User, UserAuthRequest } from '$lib/user/userBackend';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';

export let get = async (req) => {
	let service = req.query.get('service');
	let db = await mongo.db('auth');

	service = Service.getSingle(db, service);

	logger.info(`authenticating user for service=${service.name}`);
	return {
		status: 401
	};
};

export let post = async (req) => {
	let db = await mongo.db('auth');
	logger.info('requesting auth for service');
	let body = req.body;
	console.log(body);
	let service = await Service.getSingle(db, body.service);
	if (!service.auth(body.secret)) {
		logger.info(`no secret present`);
		return {
			status: 401
		};
	} else {
		let request = service.requests.find((req) => req.token === body.token);
		if (!request) {
			logger.info(`request does not exist on the service`);
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
		console.log(user);
		return {
			status: 200,
			body: user
		};
	}
};
