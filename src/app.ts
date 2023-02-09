import express, { Request, Response } from "express";
import { runDatabase } from "./database"

const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})