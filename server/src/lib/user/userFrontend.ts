import domain from 'auth-domain';
const { user } = domain;

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
	async authenticate() {
		return window.fetch('/login.json', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this)
		});
	}
}
