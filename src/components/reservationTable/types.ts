export interface Room {
    id: number,
    name: string,
    capacity: number
}

export interface Reservation {
    id: number,
    username: string,
    startDateTime: string,
    endDateTime: string,
    room: Room,
    cancelled: boolean
}