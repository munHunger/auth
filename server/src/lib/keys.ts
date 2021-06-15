import crypto from 'crypto';
import mongo from '$lib/mongo';

class Keys {
	passphrase: string;
	publicKey: string;
	privateKey: string;
}
export async function getKeys(db): Promise<Keys> {
	let keys = await mongo
		.resolveCollection(db, 'config')
		.then((collection) => collection.findOne({ name: 'keys' }));
	if (keys) return keys;

	let passphrase = crypto.randomBytes(32).toString('base64');
	return await new Promise((resolve, reject) => {
		crypto.generateKeyPair(
			'rsa',
			{
				modulusLength: 4096,
				publicKeyEncoding: {
					type: 'spki',
					format: 'pem'
				},
				privateKeyEncoding: {
					type: 'pkcs8',
					format: 'pem',
					cipher: 'aes-256-cbc',
					passphrase
				}
			},
			(err, publicKey, privateKey) => {
				if (err) return reject(err);
				let keys = { name: 'keys', passphrase, publicKey, privateKey };
				mongo
					.resolveCollection(db, 'config')
					.then((collection) => collection.insertOne(keys))
					.then(() => resolve(keys));
			}
		);
	});
}

export default {
	getKeys
};
