import { client } from "../database"
import { Request, Response, NextFunction, query } from "express"
import format from "pg-format"

const contentProjBody = ["name", "description", "estimatedTime", "repository", "startDate", "developerID"]
export const techArray = ["javascript", "python", "react", "express.js", "html", "css", "django", "postgresql", "mongodb"]

function throwError (err: any){
    throw err
}

export async function checkProjectExistance (request: Request, response: Response, next: NextFunction): Promise<Response | void>{
    const queryString = format(`
        SELECT
            *
        FROM
            "projects"
        WHERE
            id = %s
    `,
        request.params.id
    )
    const queryResult = await client.query(queryString)

    queryResult.rows[0] ? next() : response.status(404).json({ message: "Project does not exists." })
}

export function checkBodyProjProperties (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        contentProjBody.forEach((element: string) => !Object.keys(request.body).includes(element) && throwError(`Missing property ${element}`))
        Object.keys(request.body).forEach((key: string) => !contentProjBody.includes(key) && key !== "endDate" && throwError("Invalid property."))
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}

export function checkBodyProjUpdate (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        Object.keys(request.body).forEach((key: string) => !contentProjBody.includes(key) && throwError("Invalid property."))
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}

// const techArray = ["javascript", "python", "react", "express.js", "html", "css", "django", "postgresql", "mongodb"]

export function checkBodyProjTechnologies (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        Object.keys(request.body).forEach((key) => key !== "technology" && throwError("Invalid property."))
        !techArray.includes(request.body.technology) && throwError("Technology avaliable: 'javascript', 'python', 'react', 'express.js', 'html', 'css', 'django', 'postgresql', 'mongodb'")
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}

export function checkParamsDeleteProjTech (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        !techArray.includes(request.params.name) && throwError("Technology avaliable: 'javascript', 'python', 'react', 'express.js', 'html', 'css', 'django', 'postgresql', 'mongodb'")
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}