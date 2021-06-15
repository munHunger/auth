import user from '$lib/user/user';
import shajs from 'sha.js';
import crypto from 'crypto';
import mongo from '$lib/mongo';
import keys from '$lib/keys';
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
		let key = await keys.getKeys(db);
		return jwt.sign(
			{
				email: user.email,
				username: user.username
			},
			{ key: key.privateKey, passphrase: key.passphrase },
			{ algorithm: 'RS256', expiresIn: '7d', issuer: 'auth' }
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
	static async get(db, user: string) {
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

	static async validate(db, token) {
		let key = await keys.getKeys(db);
		let u = jwt.verify(token, key.publicKey, { issuer: 'auth' });
		return u;
	}
}
