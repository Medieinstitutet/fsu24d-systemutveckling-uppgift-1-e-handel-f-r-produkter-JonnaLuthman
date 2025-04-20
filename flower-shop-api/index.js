import { MongoClient } from "mongodb";

let url = "mongodb://localhost:27017";

let client = new MongoClient(url);

console.log(client);
