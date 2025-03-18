import { Review } from "./review"

export interface Appointment {
    id?: number,
    artistId: number,
    artistFullName?: string,
    city?: string,
    orderDate?: string,
    paymentSummary?: PaymentSummary,
    appointmentDate?: string[],
    customerFullName?: string,
    bodyPart?: string,
    size: Size,
    quality: Quality,
    description?: string,
    pictures?: File[],
    imageUrls?: string[],
    estimatedTime?: number,
    actualTime?: number,
    subtotal?: number,
    clientSecret?: string,
    paymentIntentId?: string,
    status?: AppointmentStatus,
    review?: Review
}

export interface PaymentSummary {
    last4: number,
    brand: string,
    expMonth: number,
    expYear: number
}

export enum Size {
    Mini = 0,
    S = 1,
    M = 2,
    L = 3,
    XL = 4,
    XXL = 5
}

export enum Quality {
    "Basic Linework" = 0,
    Tribal = 1,
    Traditional = 2,
    Watercolor = 3,
    Realism = 4,
    Geometric,
    Portraiture,
    Hyperrealism,
    Biomechanical,
    "Full Color Realism"
}

export enum AppointmentStatus {
    Pending = 0,
    PaymentMismatch = 1,
    Paid = 2,
    NoResponse = 3,
    Removed = 4,
    Declined = 5,
    Accepted = 6,
    Canceled = 7,
    Done = 10
}

export interface AppointmentDone {
    appointmentId: number
    done: boolean
    timeToday: number
}