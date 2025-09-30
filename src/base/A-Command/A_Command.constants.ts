

export enum A_CONSTANTS__A_Command_Status {
    INITIALIZED = 'INITIALIZED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export enum A_CONSTANTS_A_Command_Features {
    EXECUTE = 'execute',
    COMPLETE = 'complete',
    FAIL = 'fail',
}


export type A_CONSTANTS__A_Command_Event = 'create' | 'start' | 'execute' | 'complete' | 'fail';



