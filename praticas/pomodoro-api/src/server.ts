import "dotenv/config";
import { app } from "./app.js";

console.log("server.ts carregou");

const port = Number(process.env.PORT || 3333);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
