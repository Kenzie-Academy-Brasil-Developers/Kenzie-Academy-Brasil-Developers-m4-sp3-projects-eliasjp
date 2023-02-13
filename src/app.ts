import express from "express";
import { runDatabase } from "./database"
import { createDeveloper, createDevInfo, deleteUser, readAllDevelopers, readDeveloperById, readDeveloperProjects, updateDevInfo, updateUser } from "./logic/developers/developers";
import { checkEnumOS, checkUserExistance, updateDevReqBody } from "./middleware/middleware";


const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/developers/:id", readDeveloperById)
app.get("/developers/:id/projects", checkUserExistance, readDeveloperProjects)
app.post("/developers", createDeveloper)
app.get("/developers", readAllDevelopers)
app.patch("/developers/:id", checkUserExistance, updateDevReqBody, updateUser)
app.delete("/developers/:id", checkUserExistance, deleteUser)
app.post("/developers/:id/infos", checkUserExistance, checkEnumOS, createDevInfo)
app.patch("/developers/:id/infos", checkUserExistance, checkEnumOS, updateDevInfo)