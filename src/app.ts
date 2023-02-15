import express from "express";
import { runDatabase } from "./database"
import { createDeveloper, createDevInfo, deleteUser, readAllDevelopers, readDeveloperById, readDeveloperProjects, updateDevInfo, updateUser } from "./logic/developers/developers";
import { createProject, createProjectTechnologies, deleteProject, deleteProjTech, readProjectById, readProjects, updateProject } from "./logic/projects/projects";
import { checkEnumOS, checkUserExistance, createDevReqBody, createDevInfoReqBody, checkDevInfoReqBody, DevReqBody } from "./middleware/devMiddleware";
import { checkProjectExistance, checkBodyProjProperties, checkBodyProjUpdate, checkBodyProjTechnologies, checkParamsDeleteProjTech } from "./middleware/projMiddleware";


const app = express()
app.use(express.json())

app.listen(3333, async () => {
    await runDatabase()
})

app.get("/developers/:id", checkUserExistance, readDeveloperById)
app.get("/developers/:id/projects", checkUserExistance, readDeveloperProjects)
app.post("/developers", createDevReqBody, DevReqBody, createDeveloper)
app.get("/developers", readAllDevelopers)
app.patch("/developers/:id", checkUserExistance, DevReqBody, updateUser)
app.delete("/developers/:id", checkUserExistance, deleteUser)
app.post("/developers/:id/infos", checkUserExistance, createDevInfoReqBody, checkDevInfoReqBody, checkEnumOS, createDevInfo)
app.patch("/developers/:id/infos", checkUserExistance, checkDevInfoReqBody, checkEnumOS, updateDevInfo)

app.post("/projects", checkBodyProjProperties, createProject)
app.get("/projects/:id", checkProjectExistance, readProjectById)
app.get("/projects", readProjects)
app.patch("/projects/:id", checkProjectExistance, checkBodyProjUpdate, updateProject)
app.delete("/projects/:id", checkProjectExistance, deleteProject)
app.post("/projects/:id/technologies", checkProjectExistance, checkBodyProjTechnologies, createProjectTechnologies)
app.delete("/projects/:id/technologies/:name", checkProjectExistance, checkParamsDeleteProjTech, deleteProjTech)