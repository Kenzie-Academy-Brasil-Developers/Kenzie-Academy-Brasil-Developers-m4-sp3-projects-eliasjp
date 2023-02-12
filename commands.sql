SELECT * FROM developer_info;

SELECT * FROM developers;

SELECT developers."id", developers."name", developers."email", developers."developerInfoID", developer_info."developerSince", developer_info."prefferedOS"
FROM "developers"
LEFT JOIN "developer_info"
ON "developerInfoID" = developer_info."id"
WHERE developers."id" = 3;

SELECT pj."id", pj."name", pj."description", pj."estimatedTime", pj."repository", pj."startDate", pj."endDate", pj."developerID", dev."name", dev."email"
FROM "projects" AS pj
INNER JOIN "developers" AS dev
ON pj."developerID" = dev."id"
WHERE pj."developerID" = 5;

SELECT pj.*, dev.*
FROM "projects" AS pj
INNER JOIN "developers" AS dev
ON pj."developerID" = dev."id"
WHERE pj."developerID" = 5;

INSERT INTO "projects" ("name", "description", "estimatedTime", "repository", "startDate", "endDate", "developerID")
VALUES
('project1', 'project 3 description', '3 days', 'repository: project3', '2023-02-11', '2023-02-12', 3),
('project2', 'project 3 description', '3 days', 'repository: project3', '2023-02-11', '2023-02-12', 2),
('project3', 'project 3 description', '3 days', 'repository: project3', '2023-02-11', '2023-02-12', 1)
;

INSERT INTO "technologies" ("name")
VALUES ('Javascript'), ('Python'), ('React'), ('Express.js'), ('HTML'), ('CSS'), ('Django'), ('PostgresSQL'), ('MongoDB');

INSERT INTO "project_technologies" ()

INSERT INTO "developers" ("name", "email") VALUES ('Elias', 'elias@mail.com'), ('Lucas', 'lucas@mail.com'), ('Mateus', 'mateus@mail.com');

INSERT INTO "developer_info" ("developerSince", "prefferedOS") VALUES ('2010-01-01', 'Windows'), ('2011-01-01', 'MacOS'), ('2012-01-01', 'Linux');

UPDATE "developers" SET "developerInfoID"= 1 WHERE "id" = 3;

INSERT INTO "project_technologies" ("addedIn", "projectID", "technologyID") VALUES ('2021-02-04', 2, 1);

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