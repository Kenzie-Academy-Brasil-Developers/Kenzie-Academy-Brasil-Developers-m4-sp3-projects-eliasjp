import express, { Request, Response } from "express";
import { runDatabase } from "./database"
import { createDeveloper, readAllDevelopers, readDeveloperById } from "./logic/developers/developers";
import { readDeveloperInfo } from "./logic/developers_info/developer_info";
import { readDeveloperProjects } from "./logic/projects/projects";

const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/", readDeveloperInfo)
app.get("/developers/:id", readDeveloperById)
app.get("/developers/:id/projects", readDeveloperProjects)
app.post("/developers", createDeveloper)
app.get("/developers", readAllDevelopers)