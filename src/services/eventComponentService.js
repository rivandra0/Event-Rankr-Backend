import db from '../database/dbConn.js'
import { assert, array } from 'superstruct'
import { EventComponent } from '../structs/index.js'
//types


export default {
    async insertOne(eventComponentData) {		
        let query  = `
            insert into EventComponents (eventId, name, type, rules, componentOrder)
            values (?, ?, ?, ?, ?)
        ` 
        let vars = [
            eventComponentData.eventId, 
            eventComponentData.name, 
            eventComponentData.type, 
            eventComponentData.rules, 
            eventComponentData.componentOrder 
        ]
        
        let insertedId
        try {
            let [rows] = await db.query(query, vars);
            insertedId = rows.insertId
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        eventComponentData.id = insertedId
        //checking data type from database
        assert(eventComponentData, EventComponent)
        return {data: eventComponentData, message: 'Successfuly Insert EventComponent'}
    },
    async deleteOne(eventComponentId) {
        let query  = `
            delete from EventComponents
            where id = ?
        ` 
        let vars = [eventComponentId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }

        return { message: `deleted event component with id: ${eventComponentId} ` }
    }
}