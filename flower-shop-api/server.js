import "dotenv/config";
import { Database } from "./src/db/DataBase.js";
import app from "./app.js";
import bodyParser from "body-parser";

const PORT = 4000;
const db = new Database();

app.use(bodyParser.json());

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });
