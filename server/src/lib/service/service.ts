import type { AccessControl } from '$lib/user/user';
import crypto from 'crypto';
export class AuthRequest {
	email: string;
	token: string;
	timestamp: number;
	acl: [AccessControl];

	constructor(request: AuthRequest) {
		Object.assign(this, request);
		if (!this.token) this.token = crypto.randomBytes(32).toString('base64');
		if (!this.timestamp) this.timestamp = Date.now();
	}
}

export class Service {
	name: string;
	callback: Array<string>;
	secret: string;
	requests: Array<AuthRequest>;

	constructor(service: Service) {
		Object.assign(this, service);
	}
}

export default {
	Service
};
