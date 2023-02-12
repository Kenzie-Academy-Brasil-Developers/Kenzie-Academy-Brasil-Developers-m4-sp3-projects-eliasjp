import { NextFunction, Request, Response } from "express"
import format from "pg-format"
import { client } from "../database"

const content = ["name", "email"]

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
            id = %s;
    `,
        request.params.id
    )
    const queryResult = await client.query(queryString)

    queryResult.rows.length !== 0 ? next() : response.status(404).json({ message: "User not found." })
}

export function updateUserReqBody (request: Request, response: Response, next: NextFunction): Response | void{
    try {
        Object.keys(request.body).forEach((key: string) => {
            !content.includes(key) && throwError("Invalid property.")
        })
        next()
    }
    catch (err){
        return response.status(400).json({ message: err })
    }
}