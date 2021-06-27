import { logger } from '$lib/logger';

export enum AccessLevel {
	READ = 'READ',
	WRITE = 'WRITE',
	NONE = 'NONE'
}

export class AccessControl {
	level: AccessLevel | number = AccessLevel.NONE;
	service: string = '';
	property: string = '';

	static accessLevelFromNumber(num) {
		switch (num) {
			case 0:
				return AccessLevel.READ;
			case 1:
				return AccessLevel.WRITE;
			case 2:
				return AccessLevel.NONE;
		}
	}
}

function flattenObject(ob) {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if (typeof ob[i] == 'object' && ob[i] !== null) {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}
export class User {
	email: string = '';
	username: string = '';
	acl: Array<AccessControl> = [];
	data: any = {};

	constructor(user: User) {
		Object.assign(this, user);
	}

	applyACL(acl: Array<AccessControl>): User {
		let newUser = {} as any;
		acl.forEach((acl) => {
			if (acl.level !== AccessLevel.NONE) {
				if (!acl.service) {
					if (['email', 'username'].includes(acl.property))
						newUser[acl.property] = this[acl.property];
				} else {
					if (!newUser.data) newUser.data = {};

					let data = newUser.data;
					if (!data[acl.service]) data[acl.service] = {};
					if (acl.property === '*') data[acl.service] = this.data[acl.service];
					else data[acl.service][acl.property] = this.data[acl.service][acl.property];
				}
			}
		});
		Object.assign(newUser, newUser.data);
		delete newUser.data;
		logger.debug('applied acl', { newUser });
		newUser.acl = acl;
		return newUser;
	}
}

export class UserAuth extends User {
	salt: string = '';
	sha: string = '';

	constructor(auth: UserAuth) {
		super(auth);
		Object.assign(this, auth);
	}
}

export class UserAuthRequest extends User {
	password: string = '';
	constructor(auth: UserAuthRequest) {
		super(auth);
		Object.assign(this, auth);
	}
}

export default {
	User,
	UserAuth,
	UserAuthRequest
};
