import { client } from "../../database"
import { query, Request, Response } from "express"
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

export async function readDeveloperProjects (request: Request, response: Response): Promise<Response | void>{
    const queryString = format(`
    SELECT
        pjt."id", pjt."addedIn", pjt."projectID",
        pj."name" "projectName", pj."description", pj."estimatedTime", pj."repository", pj."startDate", pj."endDate",
        pjt."technologyID",
        tech."name" "technologyName",
        pj."developerID",
        dev."name" "developerName", dev."email"
        
    FROM
        "project_technologies" AS pjt
    INNER JOIN
        "projects" AS pj
    ON
        pjt."projectID" = pj."id"
    INNER JOIN
        "technologies" AS tech
    ON
        pjt."technologyID" = tech."id"
    INNER JOIN
        "developers" AS dev
    ON
        pj."developerID" = dev."id"
    WHERE 
        pj."developerID" = %s;
    `,
        request.params.id
    )

    const queryResult = await client.query(queryString)
    
    return response.status(200).json(queryResult.rows)
}

export async function updateUser (request: Request, response: Response): Promise<Response>{
    const queryString = format(`
        UPDATE
            "developers"
        SET
            (%I) = (%L)
        WHERE
            "id" = %s
        RETURNING
            *;
    `,
        Object.keys(request.body),
        Object.values(request.body),
        request.params.id
    )
    const queryResult = await client.query(queryString)

    return response.status(200).json(queryResult.rows[0])
}

export async function deleteUser (request: Request, response: Response): Promise<Response>{
    const queryString = format(`
        DELETE FROM
            "developers"
        WHERE
            "id" = %s
    `,
        request.params.id
    )
    await client.query(queryString)

    return response.status(200).json()
}