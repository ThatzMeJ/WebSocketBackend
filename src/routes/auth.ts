import express, { Request, Response } from 'express';
import {hashPassword, comparePassword} from '../utility/bcryptUtil'
import { query } from '../db';


const router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
    }

    // Check if the email exists in the database
    const emailCheck = await query(
      'SELECT user_email FROM users WHERE user_email = $1',
      [email]
    );

    if (emailCheck.rows.length === 0) {
       res.status(404).json({ error: "Invalid email and password." });
       return;
    }

    // Log the email (for debugging purposes)
    console.log(emailCheck.rows[0].user_email);

    // Retrieve the user's password hash
    const userPassword = await query(
      'SELECT user_password FROM users WHERE user_email = $1',
      [emailCheck.rows[0].user_email]
    );

    // Ensure that a password was found
    if (userPassword.rows.length === 0) {
       res.status(404).json({ error: "Invalid email and password." });
      return;
    }

    // Compare provided password with the stored hash
    const isValidPassword = await comparePassword(
      password,
      userPassword.rows[0].user_password
    );

    if (!isValidPassword) {
       res.status(404).json({ error: "Invalid email and password." });
       return;
    }

    // Respond with success (or you might want to generate and return a token)
     res.json(isValidPassword);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/register', async (req:Request, res: Response) => {
  try {
      const { username, email, password } = req.body
  
      if (!email || !username || !password) {
        res.status(400).json({ error: 'Please fill in credentials.' })
      }
  
      // Check if email already exists in the database
      const emailCheck = await query('SELECT 1 FROM users WHERE user_email = $1 LIMIT 1', [email]);
      if (emailCheck.rows.length > 0) {
        res.status(400).json({ error: 'Email already exists.' });
        return;
      }
  
      // Check if username already exists in the database
      const usernameCheck = await query('SELECT 1 FROM users WHERE user_username = $1 LIMIT 1', [username]);
      if (usernameCheck.rows.length > 0) {
        res.status(400).json({ error: 'Username already exists.' });
        return;
      }
  
      const securePass = await hashPassword(password);

      await query(`INSERT INTO users (user_username, user_email,user_password) VALUES ($1, $2, $3)`,
        [username, email, securePass]
      )
      res.status(201).json({
        message: 'User successfully created.',
      })
    } catch (err) {
      console.error(err)
      res.status(500).send({ message: 'Internal Server error!' })
    }
})

router.post('/logout')

export default router