import db from '../database/dbConn.js'
import { assert, array } from 'superstruct'
import { EventGroup, Event } from '../structs/index.js'
//types


export default {
    async getMany() {
        let query  = `
            select * from EventGroups 
        ` 
        let vars = []
        
        let eventGroupsData = []
        try {
            let [rows] = await db.query(query, vars);
            eventGroupsData = rows
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        //checking data type from database
        assert(eventGroupsData, array(EventGroup))
        return { data: eventGroupsData }
    },
    async getOne(eventGroupId){
        let query  = `
            select 
                e.id as id, 
                e.eventGroupId as eventGroupId,
                eg.name as eventGroupName, 
                e.name,
                e.eventOrder,
                e.isActive,
                e.startDate,
                e.createdDate
            from Events e 
            join EventGroups eg
                on e.eventGroupId = eg.id
            where eventGroupId=?

        ` 
        let vars = [eventGroupId]
        
        let eventsData = []
        try {
            let [rows] = await db.query(query, vars);
            eventsData = rows
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        //checking data type from database
        assert(eventsData, array(Event))
        return { data: eventsData }
    },
    async insertOne(eventGroupData) {
        		
        let query  = `
            insert into EventGroups(name, description)
            values(?,?)
        ` 
        let vars = [eventGroupData.name, eventGroupData.description, eventGroupData]
        
        let insertedId
        try {
            let [rows] = await db.query(query, vars);
            insertedId = rows.insertId
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        eventGroupData.id = insertedId
        //checking data type from database
        assert(eventGroupData, EventGroup)
        return { message: 'EventGroup is inserted', data:eventGroupData }
    },
    async deleteOne(eventGroupId) {
        let query  = `
            delete from EventGroups
            where id = ?
        ` 
        let vars = [eventGroupId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }

        return { message: `deleted event group with id: ${eventGroupId} ` }
    },
    async updateOne(eventGroupId, eventGroupData) {
        let query  = `
            update EventGroups
            set name = ?, description= ?
            where id = ?
        ` 
        let vars = [
            eventGroupData.name, 
            eventGroupData.description, 
            eventGroupId
        ]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during update: ${err.message}`} 
        }
        eventGroupData.id = eventGroupId

        return { message: `successfuly update eventGroup with id: ${eventGroupId}`, data:eventGroupData }
    }
}