const express = require("express");
const path = require("path");

const app = express();

// Serve the built frontend from frontend/dist
const distPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(distPath));

// For any non-API route, send back index.html so React Router can handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Use Render's PORT env var if available, otherwise 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});