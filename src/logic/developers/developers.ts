import { client } from "../../database"
import { Request, Response } from "express"
import format from "pg-format"

export async function createDeveloper (request: Request, response: Response): Promise<Response | void>{
    const queryString = format(`
        INSERT INTO "developers" (%I) VALUES (%L) RETURNING *;
    `,
        Object.keys(request.body),
        Object.values(request.body)
    )
    const queryResult = await client.query(queryString)

    return response.json(queryResult)
}

export async function readDeveloper (request: Request, response: Response): Promise<Response | void>{
    const queryString = format(`
        SELECT * FROM "developers" WHERE "id" = %s
    `,
        request.params.id
    )
    const queryResult = await client.query(queryString)

    queryResult.rows.length !== 0 ? response.status(201).json(queryResult.rows[0]) : response.status(404).json({ message: "User not found." })
}