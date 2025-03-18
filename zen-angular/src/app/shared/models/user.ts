import { Pictures } from "./pictures";

export type User = {
    id: number
    firstName: string
    lastName: string
    joinedOn: string
    email: string;
    instagram: string
    roles: string[]
    pictures: Pictures[]
    styles: ArtistStyle[]
    hourlyRate: number
    address?: Address
    city?: string
    postalCode: string
    count: number
    reviewsAverage: number
    isDeactivated?: boolean
}

export type Address = {
    line1: string
    line2?: string
    city: string
    country: string
    postalCode: string
}

export type ArtistStyle = {
    artistId: number
    style: string
}