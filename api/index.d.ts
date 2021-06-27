/**
 * Registers a new service at auth.munhunger.com
 * @param {string} name the name of the service
 * @param {string} callback a verified callback URL to direct users to after auth
 * @returns {Promise<string>} a secret token for this service
 */
export function registerService(name: string, callback: string): Promise<string>;
/**
 * Begin user authentication
 * @param {string} service name of the service
 * @param {string} callbackURL a url to direct users to after successful auth
 * @returns {string} a url to direct the user to in order to begin authentication
 */
export function beginAuth(service: string, callbackURL: string): string;
/**
 * end the authentication by requesting a JWT from the auth server
 * @param {string} service name of the service
 * @param {string} token token received from a successful user redirect from the begin auth step
 * @param {string} secret the service secret token
 * @returns {Promise<string>} a JWT for the user that logged in
 */
export function auth(service: string, token: string, secret: string): Promise<string>;
/**
 * verify that a JWT token is correct
 * @param {string} token a jwt token to verify
 * @returns {Object} user data
 */
export function verify(token: string): any;
