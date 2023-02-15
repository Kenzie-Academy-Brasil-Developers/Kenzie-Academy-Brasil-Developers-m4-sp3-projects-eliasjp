export interface IDeveloperInfo {
    developerSince: string,
    prefferedOS: string
}

export interface IDeveloperInfoExtension extends IDeveloperInfo {
    id: number
}

export interface IDeveloper {
    name: string,
    email: string,
    developerInfoID: number | null
}

export interface IDeveloperExtension extends IDeveloper {
    id: number
}

export interface IProject {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: string,
    endDate: string | null,
    developerID: number
}

export interface IProjectExtension extends IProject {
    id: number
}

export interface ITechnology {
    name: string
}

export interface ITechnologyExtension extends ITechnology {
    id: number
}

export interface IProjectTechnology {
    addedIn: string,
    projectID: number,
    technologyID: number
}

export interface IProjectTechnologyExtension extends IProjectTechnology {
    id: number
}

export interface IReadByIdDeveloper extends IDeveloperExtension {
    developerSince: string,
    prefferedOS: string
}

export interface IReadProject extends IProject, IProjectTechnologyExtension {
    developerName: string,
    email: string,
    technologyName: string,
}

export type IMergeDevExtInfo = IDeveloperExtension & IDeveloperInfo

export interface IReadProject extends IProjectExtension {
    project_technologies_id: number,
    addedIn: string,
    technologyID: number
}