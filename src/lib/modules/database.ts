import * as mongoDB from "mongodb";
import { mongoConnectionString } from '$env/static/private';

connectToDatabase();

export const collections: {
	players?: mongoDB.Collection;
	users?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
	const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongoConnectionString);
	await client.connect();

	const db: mongoDB.Db = client.db("pitmart");

	collections.players = db.collection("players");
	collections.users = db.collection("users");

	console.log("connected to db");
}
