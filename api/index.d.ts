export type ACL = {
    /**
     * access level of the property. 0=read, 1=write, 2=none
     */
    level: number;
    /**
     * if accessing root user data leave this blank, otherwise data related to the service
     */
    service: string;
    /**
     * the name of the property to access
     */
    property: string;
};
/**
 * Registers a new service at auth.munhunger.com
 * @param {string} name the name of the service
 * @param {string} callback a verified callback URL to direct users to after auth
 * @returns {Promise<string>} a secret token for this service
 */
export function registerService(name: string, callback: string): Promise<string>;
/**
 * @typedef {Object} ACL
 * @property {number} level access level of the property. 0=read, 1=write, 2=none
 * @property {string} service if accessing root user data leave this blank, otherwise data related to the service
 * @property {string} property the name of the property to access
 */
/**
 * Begin user authentication
 * @param {string} service name of the service
 * @param {string} callbackURL a url to direct users to after successful auth
 * @param {Array<ACL>} acl the requested access control list
 * @returns {Promise<string>} a url to direct the user to in order to begin authentication
 */
export function beginAuth(service: string, secret: any, callbackURL: string, acl: Array<ACL>): Promise<string>;
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
 * @returns {Promise<any>} user data
 */
export function verify(token: string): Promise<any>;
/**
 *
 * @param {string} service name of the service
 * @param {string} token the jwt of the user to update
 * @param {string} secret the secret of this service
 * @param {any} data the data to set
 * @returns {Promise<string>} a new jwt
 */
export function putData(service: string, token: string, secret: string, data: any): Promise<string>;
