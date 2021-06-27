import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';
import { AuthRequest } from '$lib/service/service';

export let post = async (req) => {
	let db = await mongo.db('auth');
	logger.info(`beginning authentication request`);

	delete req.body.email;
	delete req.body.token;
	let request = new AuthRequest(req.body);
	let service = await Service.getSingle(db, req.body.service);
	let token = await service.createRequest(db, request);
};
