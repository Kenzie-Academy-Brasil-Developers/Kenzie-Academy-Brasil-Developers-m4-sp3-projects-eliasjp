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

    return response.json(queryResult.rows[0])
}

export async function readDeveloperById (request: Request, response: Response): Promise<Response | void>{
    const queryString = format(`
        SELECT
            dev.*,
            "devI"."developerSince",
            "devI"."prefferedOS"
        FROM
            "developers" AS dev
        LEFT JOIN
            "developer_info" AS "devI"
        ON
            dev."developerInfoID" = "devI"."id"
        WHERE
            dev."id" = %s;
    `,
        request.params.id
    )
    const queryResult = await client.query(queryString)

    queryResult.rows.length !== 0 ? response.status(201).json(queryResult.rows[0]) : response.status(404).json({ message: "User not found." })
}

export async function readAllDevelopers (request: Request, response: Response): Promise<Response>{
    const queryString = `
        SELECT 
            dev.*, 
            "devI"."developerSince", "devI"."prefferedOS"
        FROM
            "developers" dev
        LEFT JOIN
            "developer_info" "devI"
        ON
            dev."developerInfoID" = "devI"."id";
    `
    const queryResult = await client.query(queryString)

    return response.status(200).json(queryResult.rows)
}