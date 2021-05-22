import MongoClient from 'mongodb';
import { logger } from '$lib/logger';

// Connection URL
const url = process.env['MONGO_URL'] || 'mongodb://localhost:27017';
logger.info('initializing mongo url=' + url);
const user = process.env['MONGO_USER'] || 'root';
const password = process.env['MONGO_PASSWORD'] || 'example';
/**
 * @param {string} name
 * @returns {Promise<import('mongodb').Collection>}
 */
export function collection(db, name) {
  return new Promise((resolve, reject) =>
    MongoClient.connect(url, { auth: { user, password } }).then((c) => {
      c.db(db).collection(name, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    })
  );
}
/**
 * @param {string} db
 * @returns {Promise<import('mongodb').Database>}
 */
export async function db(db) {
  return MongoClient.connect(url, { auth: { user, password } }).then((c) => c.db(db));
}

export function resolveCollection(db, name) {
  return new Promise((resolve, reject) =>
    db.collection(name, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  );
}

export default {
  collection,
  resolveCollection,
  db
};
