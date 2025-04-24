import { Database } from "./db/Database.js";
import app from "./app.js";

const PORT = 4000;

const db = new Database();

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to database:", error);
});
