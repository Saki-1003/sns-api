const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

// post comment api
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "A post has no content." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: req.userId, // middlewareからくる
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//get latest post api
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.json(latestPosts); //databaseからとってきたdataをreturnするのを忘れずに
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

//get the user's post
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: parseInt(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
    return res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
