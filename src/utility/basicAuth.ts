import express, { Request, Response,NextFunction, response  } from 'express';
import { comparePassword } from './bcryptUtil';
import { query } from "../db";

export const AuthenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="MyApp"');
    res.status(401).send('Authentication required.');
    return
  }

  const b64auth = authHeader.split(' ')[1]
  const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  const emailCheck = await query('SELECT user_email FROM users WHERE user_email = $1',
    [email]
  );
  if (emailCheck.rows.length === 0){
    res.status(404).json({ error: "Invalid credentials."})
    return;
  }

  const checkPassword = await query('SELECT user_password FROM users WHERE user_email = $1',
    [email]
  )
  const hashPassword = checkPassword.rows[0].user_password;
  
  const bcryptCompare: boolean = await comparePassword(password, hashPassword)

  if(bcryptCompare) {
    const reqValue = await query('SELECT user_username, user_role FROM users WHERE user_email = $1',
      [emailCheck.rows[0].user_email]
    )
    req.user = {
      username: reqValue.rows[0].user_username,
      role: reqValue.rows[0].user_role
    }
    
    next()
  } else {
    res.status(401).json('Invalid credentials')
    return
  }
}



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