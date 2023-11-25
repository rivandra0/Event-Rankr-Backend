import db from '../database/dbConn.js'
import { assert } from 'superstruct'
import { Account } from '../structs/index.js'
//types


export default {
    async insertOne(accountData) {
        		
        let query  = `
            insert into Accounts(username, pwd, groupId)
            values(?,PASSWORD(?),?)
        ` 
        let vars = [accountData.username, accountData.password, accountData.groupId]
        
        let insertedId
        try {
            let [rows] = await db.query(query, vars);
            insertedId = rows.insertId
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        accountData.id = insertedId
        //we dont need pwd 
        delete accountData.password 
        //checking data type from database
        assert(accountData, Account)
        return { message: 'Successfuly insert Account', data: accountData }
    },
    async deleteOne(accountId) {
        let query  = `
            delete from Accounts
            where id = ?
        ` 
        let vars = [accountId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }

        return { message: `account with id: ${accountId} is deleted` }
    },
    async updatePassword(accountId, newPassword) {
        let query  = `
            update Accounts
            set pwd = PASSWORD(?)
            where id = ?
        ` 
        let vars = [newPassword, accountId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during update: ${err.message}`} 
        }

        return { message: `successfuly update password with id: ${accountId}` }
    }
}