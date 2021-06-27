import { logger } from '$lib/logger';
import mongo from '$lib/mongo';
import { Service } from '$lib/service/serviceBackend';
import { User, UserAuthRequest } from '$lib/user/userBackend';
import shajs from 'sha.js';

export let post = async (req) => {
	let db = await mongo.db('auth');
	let body = req.body;

	let service = await Service.getSingle(db, body.service);

	let hash = body.hash;
	delete body.hash;
	let genHash = shajs('sha256')
		.update(JSON.stringify(body) + service.secret)
		.digest('hex');
	logger.debug('hash', { hash, genHash });
	if (genHash !== hash) {
		logger.info('hash did not match');
		return {
			status: 403
		};
	}
	let user = await User.validate(db, body.token);
	logger.info(`setting data to user`, { user, data: body.data });
	if (
		user.acl.find((acl) => acl.level === 1 && acl.service === body.service && acl.property === '*')
	)
		await user.putData(db, body.service, body.data);
	else {
		logger.warn(`ACL blocked update`);
		return {
			status: 403,
			body: 'ACL blocks update'
		};
	}
	return {
		status: 200,
		body: await UserAuthRequest.getJWT(db, user.email, user.acl)
	};
};
