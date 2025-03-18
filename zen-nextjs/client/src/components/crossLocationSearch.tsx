"use client"

import { Address } from "@/config/models/geolocation"
import SearchLocation from "./searchLocation"

export default function CrossLocationSearch() {
    const handleClick = (address: Address) =>  {
        console.log(address)
    }

    return (
        <SearchLocation handleClick={handleClick} />
    )
}