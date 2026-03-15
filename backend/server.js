const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ESM modules imported via dynamic import
const startServer = async () => {
  const { default: connectToMongoDB } = await import("./db/connectToMongoDB.js");
  const { default: authRoutes } = await import("./routes/auth.routes.js");
  const { default: messageRoutes } = await import("./routes/message.routes.js");
  const { default: userRoutes } = await import("./routes/user.routes.js");
  const { app, server } = await import("./socket/socket.js");

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    })
  );

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/users", userRoutes);

  // Serve the built frontend from frontend/dist
  const distPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(distPath));

  // For any non-API route, send back index.html so React Router can handle it
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  // Connect to DB and start server
  await connectToMongoDB();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});