import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { pool } from "../db/init.js";

const router = express.Router();
router.get("/obtener/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT title,content,id FROM user_data WHERE user_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/crear", authenticateToken, async (req, res) => {
  try {
    const { title, content, id } = req.body;
    const result = await pool.query(
      "INSERT INTO user_data (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/guardar", authenticateToken, async (req, res) => {
  try {
    console.log("jefergjrkglr");
    const { datos, id } = req.body;
    console.log({ datos, id });
    const result = await pool.query(
      "UPDATE user_data SET datos = $1 WHERE user_id = $2 RETURNING *",

      [datos, id]
    );
    console.log(result.rows);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server pin" });
  }
});

router.put("/update/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content, id } = req.body;
    const result = await pool.query(
      "UPDATE user_data SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content, req.params.id, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Data not found or unauthorized" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete data
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM user_data WHERE id = $1 AND user_id = $2",
      [req.params.id, req.body.id]
    );

    if (result.rows[0] === 0) {
      return res
        .status(404)
        .json({ message: "Data not found or unauthorized" });
    }

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
