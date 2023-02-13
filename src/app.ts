import express from "express";
import { runDatabase } from "./database"
import { createDeveloper, createDevInfo, deleteUser, readAllDevelopers, readDeveloperById, readDeveloperProjects, updateDevInfo, updateUser } from "./logic/developers/developers";
import { createProject, createProjectTechnologies, deleteProject, deleteProjTech, readProjectById, readProjects, updateProject } from "./logic/projects/projects";
import { checkEnumOS, checkUserExistance, updateDevReqBody } from "./middleware/devMiddleware";
import { checkProjectExistance, checkBodyProjProperties, checkBodyProjUpdate, checkBodyProjTechnologies, checkParamsDeleteProjTech } from "./middleware/projMiddleware";


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

app.post("/projects", checkBodyProjProperties, createProject)
app.get("/projects/:id", checkProjectExistance, readProjectById)
app.get("/projects", readProjects)
app.patch("/projects/:id", checkProjectExistance, checkBodyProjUpdate, updateProject)
app.delete("/projects/:id", checkProjectExistance, deleteProject)
app.post("/projects/:id/technology", checkProjectExistance, checkBodyProjTechnologies, createProjectTechnologies)
app.delete("/projects/:id/technology/:name", checkProjectExistance, checkParamsDeleteProjTech, deleteProjTech)