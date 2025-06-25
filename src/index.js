// index.js
import App from "./config/app.js";
import connectDb from "./config/mongoBD.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env", debug: true });

const port = process.env.PORT || 3001;
try {
  await connectDb();
  const app = App();

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("❌ Fatal startup error:", err);
}
