import * as mongoDB from "mongodb";

export const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.mongoConnectionString!);

connectToDatabase();

export const collections: {
	players?: mongoDB.Collection;
	users?: mongoDB.Collection;
	listings?: mongoDB.Collection;
	items?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
	await client.connect();

	const db: mongoDB.Db = client.db("pitmart");

	collections.players = db.collection("players");

	collections.users = db.collection("users");
	collections.users.createIndex({"discordId": 1}, {"unique": true});

	collections.listings = db.collection("listings");

	collections.items = db.collection("items");

	console.log("connected to db");
}
