export interface Review {
    appointmentId: number
    artistId?: number
    timeStamp?: string
    firstName?: string
    headline: string
    reviewText: string
    stars: number
}