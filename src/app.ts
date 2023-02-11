import express, { Request, Response } from "express";
import { runDatabase } from "./database"
import { createDeveloper, readDeveloper } from "./logic/developers/developers";
import { readDeveloperInfo } from "./logic/developers_info/developer_info";

const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/", readDeveloperInfo)
app.get("/developers/:id", readDeveloper)
app.post("/developers", createDeveloper)