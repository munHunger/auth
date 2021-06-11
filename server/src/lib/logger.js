import winston from 'winston';
import LokiTransport from 'winston-loki';
const options = {
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { labels: { service: 'auth', host: process.env['HOSTNAME'] } },
	transports: [
		//
		// - Write all logs with level `error` and below to `error.log`
		// - Write all logs with level `info` and below to `combined.log`
		//
		new winston.transports.File({ filename: '/tmp/log/auth-error.log', level: 'error' }),
		new winston.transports.File({ filename: '/tmp/log/auth-combined.log' }),
		new LokiTransport({
			host: 'https://loki.munhunger.com'
		}),
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(winston.format.colorize(), winston.format.simple())
		})
	]
};
export const logger = winston.createLogger(options);
logger.debug('setting up logger');

export default { logger };
