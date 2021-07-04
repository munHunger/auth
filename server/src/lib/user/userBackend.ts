import user, { AccessControl } from '$lib/user/user';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';
import keys from '$lib/keys';
import jwt from 'jsonwebtoken';
import { logger } from '$lib/logger';

const jwtSecret = process.env['JWT_SECRET'] || 'secret';

export class UserAuthRequest extends user.UserAuthRequest {
	constructor(auth: UserAuthRequest) {
		super(auth);
	}

	async create(db) {
		let salt = crypto.randomBytes(32).toString('base64');
		let sha = shajs('sha256')
			.update(this.password + salt)
			.digest('hex');
		delete this.password;
		return new User({ ...this, salt, sha }).create(db);
	}

	async authenticate(db) {
		let user = await mongo
			.resolveCollection(db, 'users')
			.then((collection) => collection.findOne({ email: this.email }));

		if (!user) return false;
		let sha = shajs('sha256')
			.update(this.password + user.salt)
			.digest('hex');
		return sha === user.sha;
	}

	static async getJWT(db, email: string, acl?: Array<AccessControl>) {
		let user = new User(
			await mongo.resolveCollection(db, 'users').then((collection) => collection.findOne({ email }))
		).applyACL(
			acl || [
				{
					level: 0,
					property: 'email'
				} as AccessControl,
				{
					level: 0,
					property: 'username'
				} as AccessControl
			]
		);
		let key = await keys.getKeys(db);
		logger.debug('creating jwt', { user });
		return jwt.sign(
			user,
			{ key: key.privateKey, passphrase: key.passphrase },
			{ algorithm: 'RS256', expiresIn: '7d', issuer: 'auth' }
		);
	}
}

export class User extends user.UserAuth {
	async putData(db, service, data) {
		let update = {};
		update['data.' + service] = { ...this[service], ...data };
		logger.debug(`setting new data on user`, { email: this.email, update });
		return mongo
			.resolveCollection(db, 'users')
			.then((collection) => collection.updateOne({ email: this.email }, { $set: update }));
	}

	async create(db) {
		return mongo
			.resolveCollection(db, 'users')
			.then((collection) =>
				collection.updateOne({ email: this.email }, { $set: this }, { upsert: true })
			);
	}

	static async getAll(db) {
		return mongo
			.resolveCollection(db, 'users')
			.then(async (collection) =>
				(await collection.find({}, { projection: { _id: 0, salt: 0, sha: 0 } }).toArray()).map(
					(v) => new User(v)
				)
			);
	}
	static async get(db, user: string): Promise<User> {
		return mongo
			.resolveCollection(db, 'users')
			.then(
				async (collection) =>
					new User(
						await collection.findOne({ email: user }, { projection: { _id: 0, salt: 0, sha: 0 } })
					)
			)
			.then((user) => {
				delete user.salt;
				delete user.sha;
				return user;
			});
	}

	static async validate(db, token): Promise<User> {
		let key = await keys.getKeys(db);
		let u = jwt.verify(token, key.publicKey, { issuer: 'auth' });
		return new User(u);
	}
}
