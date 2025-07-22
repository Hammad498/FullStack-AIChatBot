import { DataAPIClient } from "@datastax/astra-db-ts";
import dotenv from "dotenv";
dotenv.config();

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_ENDPOINT,{keyspace:"ragChat"});

export default db;
