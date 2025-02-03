import express, { Request, Response, NextFunction } from "express";
import { query } from "../db";
import {AuthenticateUser} from '../utility/basicAuth'

const router = express.Router()



router.all('/secret', (req: Request, res: Response, next: NextFunction) => {
  console.log('To see if this middleware method is executed before other routes')
  next()
})


router.get('/', AuthenticateUser , async (req: Request, res: Response) => {
  try {
    const user = req.user 

    res.json([user?.username, user?.role])
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server error')
  }

})





router.get('/:id')

export default router