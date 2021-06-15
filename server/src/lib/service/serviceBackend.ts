import service, { AuthRequest } from '$lib/service/service';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';

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

	async create(db) {
		this.secret = crypto.randomBytes(32).toString('base64');
		mongo
			.resolveCollection(db, 'services')
			.then((collection) =>
				Service.getSingle(db, this.name) ? undefined : collection.insertOne(this)
			)
			.then(() => this.secret);
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
