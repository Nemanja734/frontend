export type Calendar = {
    id: number,
    workingHours: WorkingHours,
    holidays?: Holiday[]
}

export type WorkingHours = {
    id: number ,
    mondayBegin: string,
    tuesdayBegin: string,
    wednesdayBegin: string,
    thursdayBegin: string,
    fridayBegin: string,
    saturdayBegin: string,
    sundayBegin: string,
    mondayEnd: string,
    tuesdayEnd: string,
    wednesdayEnd: string,
    thursdayEnd: string,
    fridayEnd: string,
    saturdayEnd: string,
    sundayEnd: string,
}

export type WorkingHoursArray = {
    day: string,
    start: string,
    end: string,
}

export type Holiday = {
    id: number,
    calendarId: number,
    startDate: Date,
    endDate: Date
}