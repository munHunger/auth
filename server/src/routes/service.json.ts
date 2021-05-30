import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';

export let post = async (req) => {
	let body = req.body;
	let db = await mongo.db('auth');
	let service = new Service(body as Service);

	logger.info(`creating service=${service.name}`);
	let secret = await service.create(db);
	return {
		status: 200,
		body: secret
	};
};

export let get = async (req) => {
	let db = await mongo.db('auth');
	logger.info(`fetching all services`);
	return {
		status: 200,
		body: await Service.getAll(db)
	};
};
