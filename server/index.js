import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Get all articles
app.get("/articles", async (req, res) => {
  console.log('Oh');
  const posts = await prisma.article.findMany();
  res.status(200).json(posts);
});

// Creates an article
app.post("/article", async (req, res) => {
  if (req.body.brand === "" || req.body.model === "")
    return res.status(400).json({"error": "Something cannot be empty."});
  const post = await prisma.article.create({
    data: { ...req.body },
  })
  res.status(200).json(post);
})

// Deletes an article by id
app.delete("/article/:id", async (req, res) => {
  if (+req.params.id != req.params.id)
    return res.status(400).json({"error": "Id cannot be non-numeric."});
  const post = await prisma.article.delete({
    where: { id: Number(req.params.id) },
  })
  res.status(200).json(post);
})

// Get an article by id
app.get("/article/:id", async (req, res) => {
  if (+req.params.id != req.params.id)
    return res.status(400).json({"error": "Id cannot be non-numeric."});
  const post = await prisma.article.findFirst({
    where: { id: Number(req.params.id) },
  })
  res.status(200).json(post);
})

// Get a user by userId
app.get("/nickname", async (req, res) => {
  const post = await prisma.nickname.findFirst({
    where: { userId: req.query['user'] },
  })
  res.status(200).json(post);
})

// Create a user
app.post("/nickname", async (req, res) => {
  if (req.body.name === "" || req.body.userId === "")
    return res.status(400).json({"error": "Something cannot be empty!"});
  const post = await prisma.nickname.upsert({
    where: { userId: req.body.userId },
    update: {},
    create: {
      name: req.body.name,
      userId: req.body.userId
    }
  })
  res.status(200).json(post);
})

// Update a user
app.put("/nickname", async (req, res) => {
  const post = await prisma.nickname.update({
    where: { userId: req.query['user'] },
    data: { name: req.body.name },
  })
  res.status(200).json(post);
})

// Search
app.get("/search", async (req, res) => {
  const post = await prisma.article.findMany({
    where: { title: { contains: req.query['criteria'] } }
  })
  res.status(200).json(post);
})

// Create a like
app.post("/like", async (req, res) => {
  if (req.body.auId === "")
    return res.status(400).json({"error": "Something isn't right!"});
  const post = await prisma.like.upsert({
    where: { 
      auId: req.body.auId
    },
    update: {},
    create: {
      articleId: req.body.articleId,
      auId: req.body.auId,
      userId: req.body.userId
    }
  })
  res.status(200).json(post);
})

// Get a like
app.get("/like/:auId", async (req, res) => {
  if (req.params.auId === "")
    return res.status(400).json({"error": "Something isn't right!"});
  const post = await prisma.like.findFirst({
    where: { auId: req.params.auId },
  })
  res.status(200).json(post);
})

// Delete a like
app.delete("/like", async (req, res) => {
  if (req.body.auId === "")
    return res.status(400).json({"error": "Something isn't right!"});
  const post = await prisma.like.delete({
    where: { auId: req.body.auId },
  })
  res.status(200).json(post);
})

// Get a user's liked articles
app.get("/likedarticles/:userId", async (req, res) => {
  if (req.params.userId === "")
    return res.status(400).json({"error": "Something isn't right!"});
  const likes = await prisma.like.findMany({
    where: { userId: req.params.userId },
  })
  var likeIds = [];
  likes.forEach(function (like, index) {
    likeIds.push(like.articleId);
  });
  console.log(likeIds);
  const articles = await prisma.article.findMany({
    where: { id: {in: likeIds} },
  })
  res.status(200).json(articles);
})


const PORT = parseInt(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT} 🎉🚀");
});
