import db from '../database/dbConn.js'
import { assert, array } from 'superstruct'
import { Player } from '../structs/index.js'
//types


export default {
    async insertOne(playerData) {
        		
        let query  = `
            insert into Players(username, name, eventGroupId)
            values(?,?)
        ` 
        let vars = [playerData.username, playerData.name, playerData.eventGroupId]
        
        let insertedId
        try {
            let [rows] = await db.query(query, vars);
            insertedId = rows.insertId
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        playerData.id = insertedId
        delete playerData.password 
        //checking data type from database
        assert(playerData, Player)
        return { message:'Successfuly insert Player', data:playerData } 
    },
    async deleteOne(playerId) {
        let query  = `
            delete from Players
            where id = ?
        ` 
        let vars = [playerId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during delete: ${err.message}`} 
        }

        return { message: `player with id: ${playerId} is deleted` }
    },
    async getMany(eventGroupId) {
        let query  = `
            select * from Players
            where eventGroupId = ?
        ` 
        let vars = [eventGroupId]
        
        let playersData = []
        try {
            let [rows] = await db.query(query, vars);
            playersData = rows
        } catch (err) {
            throw { message: `Error select query: ${err.message}`} 
        }
        assert(playersData, array(Player))
        console.log(playersData)
        return playersData
    }
}