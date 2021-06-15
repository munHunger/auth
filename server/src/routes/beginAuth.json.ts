import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Service } from '$lib/service/serviceBackend';
import { AuthRequest } from '$lib/service/service';

export let post = async (req) => {
	logger.info(`beginning authentication request`);

	delete req.body.email;
	delete req.body.token;
	let request = new AuthRequest(req.body);
};
