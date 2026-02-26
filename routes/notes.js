import { Router } from "express";
import { list, getById, create, update, remove  } from "../models/note.js";
import { Post } from "../models/index.js";

const router = Router();

//(Get)
// router.get("/", (req, res) => {
//   const notes = list();
//   res.json(notes);
// });

//Get MongoDb READ
router.get("/", async (req, res) => {
  try {
    const notes = await Post.find(); 
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data catatan" });
  }
});

// // get by id
// router.get("/:id", (req, res) => {
//   const note = getById(Number(req.params.id));
//   if (!note) {
//     return res.status(404).json({ message: "Note not found" });
//   }
//   res.json(note);
// });

//(READ BY ID MONGOOSE)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Post.findById(id); 

    if (!note) {
      return res.status(404).json({ 
        error: "Catatan tidak ditemukan",
        message: `Tidak ada catatan dengan ID: ${id}`
      });
    }

    res.status(200).json(note);

  } catch (error) {
    console.error("Error Detail:", error.message);
    res.status(500).json({ 
      error: "Terjadi kesalahan saat mencari catatan",
      details: error.message 
    });
  }
});

//post
// router.post("/", (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content) {
//     return res.status(400).json({ message: "Title and content required" });
//   }

//   const newNote = create({ title, content });
//   res.status(201).json(newNote);
// });

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const newNote = await Post.create({ title : title, content : content });
  res.status(201).json(newNote);
});

//put
router.put("/:id", (req, res) => {
  const updated = update(Number(req.params.id), req.body);

  if (!updated) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(updated);
});

// //delete
router.delete("/:id", (req, res) => {
  const success = remove(Number(req.params.id));

  if (!success) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ message: "Note deleted" });
});

export default router;