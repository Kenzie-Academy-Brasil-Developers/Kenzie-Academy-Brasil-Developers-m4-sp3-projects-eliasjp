import { NextFunction, Request, Response } from "express"
import format from "pg-format"
import { client } from "../database"

const contentDevBody = ["name", "email"]
const contentDevInfoBody = ["developerSince", "prefferedOS"]
const enumOS = ["Windows", "MacOS", "Linux"]

function throwError (err: any){
    throw err
}

export async function checkUserExistance (request: Request, response: Response, next: NextFunction): Promise<Response | void>{
    const queryString = format(`
        SELECT
            *
        FROM
            "developers"
        WHERE
            "id" = %s;
    `,
        request.params.id
    )
    const queryResult = await client.query(queryString)

    queryResult.rows.length !== 0 ? next() : response.status(404).json({ message: "User not found." })
}

export function updateDevReqBody (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        Object.keys(request.body).forEach((key: string) => !contentDevBody.includes(key) && throwError("Invalid property."))
        Object.values(request.body).forEach((value: any) => typeof value !== "string" && throwError(`Incorrect value.`))
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}

export function updateDevInfoReqBody (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        Object.keys(request.body).forEach((key: string) => !contentDevInfoBody.includes(key) && throwError("Invalid property."))
        Object.values(request.body).forEach((value: any) => typeof value !== "string" && throwError(`Incorrect value.`))
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}

export function checkEnumOS (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        request.body.prefferedOS && !enumOS.includes(request.body.prefferedOS) && throwError("PrefferedOS must be one of those options, 'Windows', 'MacOS', 'Linux'.")
        next()
    }
    catch (err){
        return response.status(400).json({ message : err })
    }
}