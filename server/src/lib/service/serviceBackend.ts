import service, { AuthRequest } from '$lib/service/service';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';

export class Service extends service.Service {
	constructor(service: Service) {
		super(service);
		Object.assign(this, service);
	}

	auth(secret) {
		return (
			shajs('sha256')
				.update(secret + this.salt)
				.digest('hex') === this.secret
		);
	}

	async create(db) {
		let secret = crypto.randomBytes(32).toString('base64');
		this.salt = crypto.randomBytes(32).toString('base64');

		this.secret = shajs('sha256')
			.update(secret + this.salt)
			.digest('hex');
		return mongo
			.resolveCollection(db, 'services')
			.then((collection) =>
				collection.updateOne({ name: this.name }, { $set: this }, { upsert: true })
			)
			.then(() => secret);
	}
	static async getSingle(db, name) {
		return mongo
			.resolveCollection(db, 'services')
			.then((collection) => collection.findOne({ name }, { projection: { _id: 0 } }))
			.then((data) => new Service(data));
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
