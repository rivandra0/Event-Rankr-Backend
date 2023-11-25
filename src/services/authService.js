import jwt from '../modules/jwt.js'
import db from '../database/dbConn.js'
import { assert } from 'superstruct'
import { Account } from '../structs/index.js'
//types


export default {
    async login(accountData) {		
        // finding one matching account
        let query  = `
            select a.id, a.username, ag.name as accountGroup from Accounts a 
            join AccountGroups ag
                on a.groupId=ag.id
            where username=? and pwd=PASSWORD(?)
        ` 
        let vars = [accountData.username, accountData.password]
        
        let [rows] = await db.query(query, vars);
        if(rows.length == 0) {
            throw { message: 'Wrong Credentials', code:400 }
        }
        let accountRow = rows[0]

        //checking data type from database
        assert(accountRow, Account)

        let token = jwt.generateToken(accountRow, '1h')
        accountRow.token = token
        return { data: accountRow, message: 'Succesfuly Logged in' }
    }
}