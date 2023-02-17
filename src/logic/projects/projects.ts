import { client } from "../../database"
import { Request, Response } from "express"
import format from "pg-format"
import { techArray } from "../../middleware/projMiddleware"
import { QueryResult } from "pg"
import { IProjectExtension, IProjectTechnology, IProjectTechnologyExtension, IReadProject } from "../../interface/interface"

export async function createProject (request: Request, response: Response): Promise<Response>{
    try {
    const queryString: string = format(`
        INSERT INTO
            "projects" (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(request.body),
        Object.values(request.body),
    )
    const queryResult: QueryResult<IProjectExtension> = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
    }
    catch (err: any){
        const newError = err
        if (err.message.includes("invalid input syntax")){
            return response.status(400).json({ message: "Invalid value for an property." })
        }
        else if (err.message.includes('violates foreign key constraint "projects_developerID_fkey"')){
            return response.status(409).json({ message: "Developer ID does not exists." })
        }
        else {
            return response.status(409).json({ message: 'Unexpected error has ocurrued.' })
        }
    }
}

export async function readProjectById (request: Request, response: Response): Promise<Response>{
    const queryString: string = format(`
        SELECT
            prj.*,
            "prj_t"."id" "project_technologies_id", "prj_t"."addedIn", "prj_t"."technologyID"
        FROM
            "projects" AS prj
        LEFT JOIN
            "project_technologies" AS prj_t
        ON
            "prj_t"."projectID" = prj."id"
        WHERE
            prj."id" = %s;
    `,
        request.params.id
    )
    const queryResult: QueryResult<IReadProject> = await client.query(queryString)

    return response.status(200).json(queryResult.rows[0])
}

export async function readProjects (request: Request, response: Response): Promise<Response>{
    const queryString = format(`
        SELECT
            prj.*,
            "prj_t"."id" "project_technologies_id", "prj_t"."addedIn", "prj_t"."technologyID"
        FROM
            "projects" AS prj
        LEFT JOIN
            "project_technologies" AS prj_t
        ON
            "prj_t"."projectID" = prj."id"
        ORDER BY
            prj."id" asc;
    `,
        request.params.id
    )
    const queryResult: QueryResult<IReadProject> = await client.query(queryString)

    return response.status(200).json(queryResult.rows)
}

export async function updateProject (request: Request, response: Response): Promise<Response>{
    try {
        const queryString: string = format(`
            UPDATE
                "projects"
            SET
                (%I) = ROW (%L)
            WHERE
                id = %s
            RETURNING *;
        `,
            Object.keys(request.body),
            Object.values(request.body),
            request.params.id
        )
        const queryResult: QueryResult<IProjectExtension> = await client.query(queryString)

        return response.status(200).json(queryResult.rows[0])
    }
    catch (err: any){
        if (err.message.includes("invalid input syntax")){
            return response.status(400).json({ message: "A key has an incorrect input value." })
        }
        else if (err.message.includes('violates foreign key constraint "projects_developerID_fkey"')){
            return response.status(409).json({ message: "Developer ID does not exists." })
        }
        else {
            return response.status(500).json({ message: `Unexpected error: ${err}.` })
        }
    }
}

export async function deleteProject (request: Request, response: Response): Promise<Response>{
    const queryString: string = format(`
        DELETE FROM
            "projects"
        WHERE
            "id" = %s
    `,
        request.params.id
    )
    await client.query(queryString)

    return response.status(204).json()
}

export async function createProjectTechnologies (request: Request, response: Response): Promise<Response>{
    const date: Date = new Date()
    const month: string | number = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    const nowDate: string = `${date.getFullYear()}-${month}-${date.getDate()}`

    const positionTech: number = techArray.indexOf(request.body.technology.toLowerCase()) + 1

    const queryString: string = format(`
        INSERT INTO
            "project_technologies" ("addedIn", "projectID", "%s")
        VALUES
            ('%s', %s, %s)
        RETURNING *;
    `,
        "technologyID",
        nowDate,
        request.params.id,
        positionTech
    )
    const queryResult: QueryResult<IProjectTechnologyExtension> = await client.query(queryString)

    return response.status(200).json(queryResult.rows[0])
}

export async function deleteProjTech (request: Request, response: Response): Promise<Response>{
    const positionTech: number = techArray.indexOf(request.params.name.toLowerCase()) + 1

    const queryString: string = format(`
        DELETE FROM
            "project_technologies"
        WHERE
            "projectID" = %s AND "technologyID" = %s
    `,
        request.params.id,
        positionTech
    )
    await client.query(queryString)
    
    return response.status(204).json()
}