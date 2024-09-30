"use server"

import axios from "axios"
import * as cheerio from "cheerio"

async function getDataFromUrl(url: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.get(url)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return cheerio.load(data)
}

export async function getCalendarData() { // returns the up to date iframe calender src from the robertsbridge.org.uk website
    const $ = await getDataFromUrl("https://www.robertsbridge.org.uk/Calendar/")

    const iframeSrc = $("iframe").attr("src")
    return iframeSrc??""
}