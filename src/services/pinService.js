import db from '../database/dbConn.js'
import { assert } from 'superstruct'
import { Pin } from '../structs/index.js'
//types


export default {
    async insertOne(pinData) {
        		
        let query  = `
            insert into Pins(accountId, playerId)
            values(?, ?)
        ` 
        let vars = [pinData.accountId, pinData.playerId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        assert(pinData, Pin)
        return { message: 'Successfuly Insert Pin', data:pinData }
    },
    async deleteOne (pinData) {
        let query = `
            delete from Pins
            where accountId=? and playerId=?
        `
        let vars = [pinData.accountId, pinData.playerId]
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during delete: ${err.message}`} 
        }
        
        return { message:'successfuly delete pin' }
    },
    async getMany (accountId) {
        let query = `
            select * from Pins where accountId=?
        `
        let vars = [accountId]
        let pinsData 
        try {
            let [rows] = await db.query(query, vars);
            pinsData = rows
        } catch (err) {
            throw { message: `Error during select: ${err.message}`} 
        }
        
        return { message:'successfuly get pins', data:pinsData }
    }
}