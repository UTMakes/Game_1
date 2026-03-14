// saveStore.js — IndexedDB read/write via idb
import { openDB } from 'idb';

const DB_NAME = 'gridflow-saves';
const DB_VERSION = 1;
const STORE_NAME = 'saves';

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

export async function saveSate(key, data) {
  const db = await getDB();
  await db.put(STORE_NAME, data, key);
}

export async function loadState(key) {
  const db = await getDB();
  return db.get(STORE_NAME, key);
}

export async function deleteSave(key) {
  const db = await getDB();
  await db.delete(STORE_NAME, key);
}
