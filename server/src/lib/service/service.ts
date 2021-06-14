import crypto from 'crypto';
export class AuthRequest {
	email: string;
	token: string;
	timestamp: number;

	constructor(request: AuthRequest) {
		Object.assign(this, request);
		console.log(this);
		if (!this.token) this.token = crypto.randomBytes(32).toString('base64');
		if (!this.timestamp) this.timestamp = Date.now();
		console.log(this);
	}
}

export class Service {
	name: string;
	callback: Array<string>;
	secret: string;
	privateKey: string;
	publicKey: string;
	privateSecret: string;
	requests: Array<AuthRequest>;

	constructor(service: Service) {
		Object.assign(this, service);
	}
}

export default {
	Service
};
