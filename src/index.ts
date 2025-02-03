import express, { Request, Response } from 'express';
import cors from 'cors' 
import dotenv from 'dotenv'
import path from 'path';
import userRoutes from './routes/user'
import authRoutes from './routes/auth'
import pool from './db';
dotenv.config({ path: path.resolve(__dirname, '../.env') });


pool.connect((err, client, release) => {
  if (err) {
      return console.error(
          'Error acquiring client', err.stack)
  }
  client?.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
          return console.error(
              'Error executing query', err.stack)
      }
      console.log("Connected to Database !")
  })
})


const PORT = process.env.PORT || 3001
const app = express();

app.use(cors())
app.use(express.json())

app.use('/v1/auth', authRoutes)
app.use('/v1/users', userRoutes)


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})