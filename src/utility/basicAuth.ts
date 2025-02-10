import express, { Request, Response, NextFunction, response } from 'express';
import { comparePassword } from './bcryptUtil';
import { query } from "../db";

export const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="MyApp"');
       res.status(401).json({ error: 'Authentication required.' });
       return
    }

    const b64auth = authHeader.split(' ')[1];
    if (!b64auth) {
       res.status(401).json({ error: 'Invalid authorization header format.' });
       return
    }

    const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Validate email and password presence
    if (!email || !password) {
       res.status(400).json({ error: 'Email and password are required.' });
       return
    }

    // Single query to get all user data we need
    const userResult = await query(
      'SELECT user_password, user_username, user_role FROM users WHERE user_email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
       res.status(401).json({ error: 'Invalid credentials.' });
       return
    }

    const { user_password: hashPassword, user_username, user_role } = userResult.rows[0];

    const isValidPassword = await comparePassword(password, hashPassword);

    if (!isValidPassword) {
       res.status(401).json({ error: 'Invalid credentials.' });
       return
    }

    req.user = {
      username: user_username,
      role: user_role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
     res.status(500).json({ error: 'Internal server error.' });
     return
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: 'Freemium' | 'Premium'
        // add additional fields if needed, e.g.:
        // email?: string;
        // roles?: string[];
      };
    }
  }
}