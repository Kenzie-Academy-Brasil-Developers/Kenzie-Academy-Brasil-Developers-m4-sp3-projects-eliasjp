import { client } from "../../database"
import { Request, Response } from "express"
import format from "pg-format"

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