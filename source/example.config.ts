
export const db={
    /** host name for the database */
    host:"localhost",
    /** username for the database connection */
    user:"mvc_server",
    /** password for the database connection */
    pass:"password",
    /** database name for the app */
    db:"db_name"
}
export const authorization={
    /**  lifetime of the token in the browser in ms */
    tokenLifeBrowser:100_000,

    /** lifetime of the token in the database in ms
    (should be shorter than browser to inform user that session has ended)*/
    tokenLifeDatabase:90_000
}
