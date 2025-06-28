import app from "./app";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

// ✅ Only listen if the file is run directly (NOT when imported by Vercel)
if (require.main === module) {
  console.log(process.env.PORT);

  const port = process.env.PORT || 4000;
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (err: unknown) => {
    console.log("Unhandled error rejections");

    if (err instanceof Error) {
      console.log(err);
      console.log(err.name, err.message);
    } else {
      console.log(err);
    }

    server.close(() => {
      process.exit(1);
    });
  });
}

// Export app for Vercel or testing
export default app;
