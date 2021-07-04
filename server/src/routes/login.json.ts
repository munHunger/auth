import mongo from '$lib/mongo';
import { UserAuthRequest, User } from '$lib/user/userBackend';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';
import { AuthRequest } from '$lib/service/service';

export let get = async (req) => {
	logger.debug(`checking user token`, { locals: req.locals });
	if (!req.locals.authenticated) {
		logger.info(`not authenticated`);
		return { status: 401 };
	} else {
		let db = await mongo.db('auth');
		let serviceName = req.query.get('service');
		let token = req.query.get('token');
		let user = await User.validate(db, req.locals.token);
		logger.info(`got user=${user.email} from session`, { user });
		logger.info(`Creating auth request to service=${serviceName}`);
		let service = await Service.getSingle(db, serviceName);
		if (!service)
			return {
				status: 404,
				body: { error: 'service not found' }
			};
		if (token) {
			let serviceToken = await service.addEmailToRequest(db, user.email, token);
			return {
				status: 200,
				body: { serviceToken }
			};
		}
		let serviceToken = await service.createRequest(
			db,
			new AuthRequest({ email: user.email } as AuthRequest)
		);
		return {
			status: 200,
			body: { serviceToken }
		};
	}
};

export let put = async (req) => {
	let body = req.body;
	let db = await mongo.db('auth');
	let user = new UserAuthRequest(body as UserAuthRequest);
	let auth = await user.authenticate(db);
	let serviceName = req.query.get('service');
	let serviceToken;
	logger.info(`authenticating user=${user.email} authenticated=${auth}`);
	let jwt = await UserAuthRequest.getJWT(db, user.email);
	if (auth) {
		let session = req.locals;
		session.token = jwt;
	}
	if (serviceName) {
		logger.info(`Creating auth request to service=${serviceName}`);
		let service = await Service.getSingle(db, serviceName);
		if (!service)
			return {
				status: 404,
				body: { error: 'service not found' }
			};
		serviceToken = await service.createRequest(
			db,
			new AuthRequest({ email: user.email } as AuthRequest)
		);
	}
	return {
		status: auth ? 200 : 401,
		body: auth ? { jwt, serviceToken } : undefined,
		headers: {
			'Set-Cookie': `token=${jwt}`
		}
	};
};
