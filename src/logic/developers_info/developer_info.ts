import { client } from "../../database"
import { Request, Response} from "express"

export async function readDeveloperInfo (request: Request, response: Response): Promise<Response>{
    const queryString = `SELECT * FROM "developer_info";`

    const queryResult = await client.query(queryString)

    return response.json(queryResult.rows)
}