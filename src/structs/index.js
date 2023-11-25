import { assert, object, number, string, array, date, optional, boolean, nullable } from 'superstruct'

//types
const Account = object({
    id: optional(number()),
    username: string(),
    password: optional(string()),
    accountGroup: optional(string()),
    groupId: optional(number()),
    token: optional(string())
})

const Event = object({
    id: optional(number()),
    eventGroupId: optional(number()),
    eventGroupName: optional(string()),
    name: string(),
    description: optional(string()),
    eventOrder: optional(number()),
    isActive:optional(number()),
    startDate: optional(date()),
    createdDate: optional(date()),

})

const EventGroup = object({
    id: optional(number()),
    name: string(),
    description: optional(string()),
    events: optional([Event]),
    createdDate: optional(date())
})

const EventComponent = object({
    id: optional(number()),
    eventId: optional(number()),
    name: string(),
    type: string(),
    rules: nullable(string()),
    componentOrder: number(),
    createdDate: optional(date())
})

const Player = object({
    id: optional(number()),
    username: nullable(string()),
    name: string(),
    eventGroupId: number(),
    createdDate: optional(date())
})

const Score = object({
    id:optional(number()),
    eventComponentId: number(),
    playerId: number(),
    stringScore: nullable(string()),
    numberScore: nullable(number()),
    boolScore: nullable(boolean()),
    dateScore: nullable(date())
})

const Pin = object({
    accountId: number(),
    playerId: number()
})

export { Account, EventGroup, Event, EventComponent, Player, Score, Pin }