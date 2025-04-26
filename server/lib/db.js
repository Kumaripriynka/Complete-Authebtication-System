import mysql from 'mysql2/promise';
let connection;

export const connectToDatabase = async () => {
    if(!connection){
       connection = await mysql.createConnection({
           host: process.env. MYSQLHOST,
           user: process.env.MYSQLUSER,
           password: process.env.MYSQLPASSWORD,
           database: process.env.MYSQLDATABASE
       })
    }
    return connection;
}
