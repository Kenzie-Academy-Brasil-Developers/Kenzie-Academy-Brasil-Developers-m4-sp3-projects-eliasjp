import express from "express";
import { runDatabase } from "./database"
import { createDeveloper, deleteUser, readAllDevelopers, readDeveloperById, readDeveloperProjects, updateUser } from "./logic/developers/developers";
import { checkUserExistance, updateUserReqBody } from "./middleware/middleware";


const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/developers/:id", readDeveloperById)
app.get("/developers/:id/projects", checkUserExistance, readDeveloperProjects)
app.post("/developers", createDeveloper)
app.get("/developers", readAllDevelopers)
app.patch("/developers/:id", checkUserExistance, updateUserReqBody, updateUser)
app.delete("/developers/:id", checkUserExistance, deleteUser)