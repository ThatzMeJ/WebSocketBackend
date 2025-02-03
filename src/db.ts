import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from a .env file

// Create a PostgreSQL pool
 export const pool = new Pool({
  user: process.env.DB_USER,       // PostgreSQL username
  host: process.env.DB_HOST,       // Database host (e.g., localhost)
  database: process.env.DB_NAME,   // Database name
  password: process.env.DB_PASS, // PostgreSQL password
  port: Number(process.env.DB_PORT), // PostgreSQL port (default is 5432)
});

// Optionally, create a query helper to simplify database access
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export default pool;
