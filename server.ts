const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
// const corsOptions = require("./config/corsConfig");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Fetch All Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true, comments: true, cat: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ✅ Create a New Post
app.post("/write", async (req, res) => {
  try {
    const { title, desc, image, catSlug, userEmail } = req.body;
    const newPost = await prisma.post.create({
      data: { title, desc, image, catSlug, userEmail, slug: title.replace(/\s+/g, "-").toLowerCase() },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ✅ Fetch All Categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { posts: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
