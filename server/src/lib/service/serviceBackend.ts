import service, { AuthRequest } from '$lib/service/service';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';
import { logger } from '$lib/logger';

export class Service extends service.Service {
	constructor(service: Service) {
		super(service);
		Object.assign(this, service);
	}

	auth(request) {
		let hash = request.hash;
		delete request.hash;
		return (
			shajs('sha256')
				.update(JSON.stringify(request) + this.secret)
				.digest('hex') === hash
		);
	}

	async create(db): Promise<string> {
		this.secret = crypto.randomBytes(32).toString('base64');
		return mongo.resolveCollection(db, 'services').then(async (collection) => {
			let stored = await Service.getSingle(db, this.name);
			if (!stored) {
				await collection.insertOne(this);
				return this.secret;
			}
		});
	}
	static async getSingle(db, name) {
		logger.debug('fetching single service', { name });
		return mongo
			.resolveCollection(db, 'services')
			.then((collection) => collection.findOne({ name }, { projection: { _id: 0 } }))
			.then((data) => {
				if (!data) return;
				logger.debug('got service data', { data });
				return new Service(data);
			});
	}

	static async getAll(db) {
		return mongo
			.resolveCollection(db, 'services')
			.then((collection) => collection.find({}, { projection: { name: 1, callback: 1 } }).toArray())
			.then((services) => services.map((service) => new Service(service)));
	}

	async createRequest(db, request: AuthRequest) {
		if (!this.requests) this.requests = [];
		this.requests.push(request);
		return mongo
			.resolveCollection(db, 'services')
			.then((collection) =>
				collection.updateOne(
					{ name: this.name },
					{
						$push: {
							requests: request
						}
					}
				)
			)
			.then(() => request.token);
	}
}
