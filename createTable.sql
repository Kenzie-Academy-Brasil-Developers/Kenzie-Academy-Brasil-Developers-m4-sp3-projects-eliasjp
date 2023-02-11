CREATE TYPE "operation_system" AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_info (
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "prefferedOS" operation_system NOT NULL
);

CREATE TABLE  IF NOT EXISTS developers (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "developerInfoID" INTEGER REFERENCES "developer_info"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "estimatedTime" VARCHAR(20) NOT NULL,
    "repository" VARCHAR(20) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "developerID" INTEGER REFERENCES "developers"("id") NOT NULL
);

CREATE TABLE IF NOT EXISTS technologies (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "specification" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_technologies (
    "id" SERIAL PRIMARY KEY,
    "projectID" INTEGER REFERENCES "projects"("id") NOT NULL,
    "technologyID" INTEGER REFERENCES "technologies"("id") NOT NULL
);