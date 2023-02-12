import express from "express";
import { runDatabase } from "./database"
import { createDeveloper, readAllDevelopers, readDeveloperById, readDeveloperProjects } from "./logic/developers/developers";


const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/developers/:id", readDeveloperById)
app.get("/developers/:id/projects", readDeveloperProjects)
app.post("/developers", createDeveloper)
app.get("/developers", readAllDevelopers)