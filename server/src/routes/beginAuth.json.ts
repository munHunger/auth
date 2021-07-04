import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';
import { AuthRequest } from '$lib/service/service';
import shajs from 'sha.js';

export let post = async (req) => {
	let db = await mongo.db('auth');
	logger.info(`beginning authentication request`, { body: req.body });
	delete req.body.email;
	delete req.body.token;
	let request = new AuthRequest(req.body);
	let service = await Service.getSingle(db, req.body.service);
	if (!service)
		return {
			status: 404,
			body: 'could not find service ' + req.body.service
		};

	let hash = req.body.hash;
	delete req.body.hash;
	if (
		shajs('sha256')
			.update(JSON.stringify(req.body) + service.secret)
			.digest('hex') !== hash
	) {
		logger.info('hash did not match');
		return {
			status: 403
		};
	}
	let token = await service.createRequest(db, request);
	return {
		body: token
	};
};
