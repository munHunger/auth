import user from '$lib/user/user';

export class User extends user.UserAuthRequest {
	constructor(auth: User) {
		super(auth);
	}

	async register() {
		return window.fetch('/register.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this)
		});
	}
	async authenticate(service: [string]) {
		return window.fetch('/login.json' + (service ? `?service=${service}` : ''), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this)
		});
	}
}
