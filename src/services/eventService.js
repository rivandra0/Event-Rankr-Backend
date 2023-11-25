import db from '../database/dbConn.js'
import { assert, array } from 'superstruct'
import { Event, EventComponent } from '../structs/index.js'
//types


export default {
    async getOne(eventId){
        
        // let eventGroupRes
        // try {
        //     let [rows] = await db.query('select eventGroupId from Events where id=?', [eventId])
        //     eventGroupRes = rows
        // } catch (err) {
        //     throw { message: `error when searching for the event`, code: 400}
        // }

        // if(eventGroupRes.length < 1) {
        //     throw { message: `No Event with id ${eventId} Found`, code: 404}
        // }

        // let eventGroupId = eventGroupRes[0].eventGroupId
        

        let scoresData = []
        try {
            let [rows] = await db.query('CALL getManyScores( ? )', [eventId]);
            scoresData = rows[0]
        } catch (err) {
            throw { message: `Error during querying score: ${err.message}`} 
        }
        //removing a useless column : playerId
        scoresData = scoresData.map(data => {
            delete data.playerId
            return data
        })

        let eventComponentsData = []
        try {
            let [rows] = await db.query('select * from EventComponents where eventId= ?', [eventId]);
            eventComponentsData = rows
        } catch (err) {
            throw { message: `Error during querying eventComponents: ${err.message}`} 
        }
        assert(eventComponentsData, array(EventComponent))
        console.log(JSON.parse(eventComponentsData[0].rules))
        return {scoresData, eventComponentsData}
    },
    async insertOne(eventData) {
        		
        let query  = `
            insert into Events(eventGroupId, name, eventOrder, isActive, startDate)
            values(?, ?, ?, ?, ?)
        ` 
         
        //checking data type from user
        assert(eventData, Event)
        let vars = [
            eventData.eventGroupId,
            eventData.name, 
            eventData.eventOrder,
            eventData.isActive,
            eventData.startDate
        ]
        
        let insertedId
        try {
            let [rows] = await db.query(query, vars);
            insertedId = rows.insertId
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }
        
        eventData.id = insertedId
        //checking data type from database
        assert(eventData, Event)
        return { message:'Successfuly insert Event', data:eventData }
    },
    async deleteOne(eventId) {
        let query  = `
            delete from Events
            where id = ?
        ` 
        let vars = [eventId]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during insert: ${err.message}`} 
        }

        return { message: `deleted event with id: ${eventId} ` }
    },
    async updateOne(eventId, eventData) {
        let query  = `
            update Events
            set 
                eventGroupId= ? , 
                name = ? , 
                eventOrder= ? , 
                isActive = ? , 
                startDate = ? 
            where id = ?
        ` 

        let vars = [
            eventData.eventGroupId, 
            eventData.name,
            eventData.eventOrder,
            eventData.isActive,
            eventData.startDate,
            eventId
        ]
        
        try {
            let [rows] = await db.query(query, vars);
        } catch (err) {
            throw { message: `Error during update: ${err.message}`} 
        }
        eventData.id = eventId

        return { 
            message: `successfuly update event with id: ${eventId}`, 
            data: eventData 
        }
    }
}

