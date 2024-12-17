import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { pool } from "../db/init.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, first_name, last_name, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/update/profile", authenticateToken, async (req, res) => {
  try {
    const { username, firstName, lastName, email } = req.body;
    const id = req.user.id; // Usar el ID del token en lugar del body

    // Validación de campos requeridos
    if (!username || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username or email is already taken
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3",
      [username, email, id]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const result = await pool.query(
      "UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4 WHERE id = $5 RETURNING id, username, first_name, last_name, email",
      [username, firstName, lastName, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error); // Para debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/delete/profile/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error); // Para debugging
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
