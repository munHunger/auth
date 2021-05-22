import { user } from 'auth-domain';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';
import jwt from 'jsonwebtoken';

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
	static async getJWT(db, email: string) {
		let user = new User(
			await mongo.resolveCollection(db, 'users').then((collection) => collection.findOne({ email }))
		);
		return jwt.sign(
			JSON.stringify({
				email: user.email,
				username: user.username
			}),
			jwtSecret
		);
	}
}

export class User extends user.UserAuth {
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
}
