import { client } from "../../database"
import { Request, Response } from "express"
import format from "pg-format"
import { QueryResult } from "pg"
import { IMergeDevExtInfo, IDeveloperExtension, IDeveloperInfoExtension, IReadByIdDeveloper, IReadProject, IDeveloperInfo } from "../../interface/interface"

export async function createDeveloper (request: Request, response: Response): Promise<Response | void>{
    try {
        const queryString: string = format(`
            INSERT INTO "developers" (%I) VALUES (%L) RETURNING *;
        `,
            Object.keys(request.body),
            Object.values(request.body)
        )
        const queryResult: QueryResult<IDeveloperInfoExtension> = await client.query(queryString)
        return response.status(201).json(queryResult.rows[0])
    }
    catch (err: any){
        return err.message.includes('unique constraint "unique_email"')
        ? response.status(400).json({ message: "Email already exists." })
        : response.status(400).json({ message: "An error has ocurred." })
    }

}

export async function readDeveloperById (request: Request, response: Response): Promise<Response | void>{
    const queryString: string = format(`
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
    const queryResult: QueryResult<IReadByIdDeveloper> = await client.query(queryString)

    response.status(201).json(queryResult.rows[0])
}

export async function readAllDevelopers (request: Request, response: Response): Promise<Response>{
    const queryString: string = `
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
    const queryResult: QueryResult<IReadByIdDeveloper> = await client.query(queryString)

    return response.status(200).json(queryResult.rows)
}

export async function readDeveloperProjects (request: Request, response: Response): Promise<Response | void>{
    const queryString: string = format(`
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

    const queryResult: QueryResult<IReadProject> = await client.query(queryString)
    
    return response.status(200).json(queryResult.rows)
}

export async function updateUser (request: Request, response: Response): Promise<Response>{
        try {
        const queryString: string = format(`
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
        const queryResult: QueryResult<IDeveloperExtension> = await client.query(queryString)

        return response.status(200).json(queryResult.rows[0])
    }
    catch (err: any){
        return err.message.includes('unique constraint "unique_email"')
        ? response.status(400).json({ message: "Email already exists." })
        : response.status(400).json({ message: "An error has ocurred." })
    }
}

export async function deleteUser (request: Request, response: Response): Promise<Response>{
    try {
        const queryString: string = format(`
            DELETE FROM
                "developers"
            WHERE
                "id" = %s
        `,
            request.params.id
        )
        await client.query(queryString)

        return response.status(204).json()
    }
    catch (err: any){
        return err.message.includes('violates foreign key constraint "projects_developerID_fkey"')
        ? response.status(409).json({ message: "Violates foreign key constraint" })
        : response.status(400).json({ message: "Unexpected error happened" })
    }
}

export async function createDevInfo (request: Request, response: Response): Promise<Response>{
    const queryString: string = `
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
    const queryResult: QueryResult<IDeveloperExtension & IDeveloperInfo> = await client.query(queryString)

    if (queryResult.rows[0].developerInfoID !== null){
        return response.status(409).json({ message: "Developer information alredy registered." })
    }

    const devInfoString: string = format(`
        INSERT INTO
            "developer_info" (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(request.body),
        Object.values(request.body)
    )
    const devInfoResult: QueryResult<IDeveloperInfoExtension> = await client.query(devInfoString)

    const devString: string = format(`
        UPDATE
            "developers"
        SET
            "developerInfoID" = %s
        WHERE
            "id" = %s
            AND
            "developerInfoID" IS NULL
        RETURNING *;
        `,
            devInfoResult.rows[0].id,
            request.params.id
    )
    const devResult: QueryResult<IDeveloperExtension> = await client.query(devString)

    return response.status(201).json(devResult.rows[0])
}

export async function updateDevInfo (request: Request, response: Response): Promise<Response>{
    const queryString: string = format(`
        UPDATE
            "developer_info" AS "devI"
        SET
            (%I) = ROW (%L)
        FROM
            "developers" as dev
        WHERE
            dev."developerInfoID" = "devI"."id"
        RETURNING *;
    `,
        Object.keys(request.body),
        Object.values(request.body),
        request.params.id
    )
    const queryResult: QueryResult<IMergeDevExtInfo> = await client.query(queryString)

    return response.status(200).json(queryResult.rows[0])
}