import SideNav from "./sideNav/sideNav"

export const scrollBarStyle = "scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent"

const themeType = "dark"
export const theme = {
    sideNav: themeType == "dark" ? "#1F1F1F" : "",
    body: themeType == "dark" ? "#242424" : "",
    text: themeType == "dark" ? "#FFFFFF" : "",
}

export const bodyStyling = `flex-1 h-screen overflow-auto ${scrollBarStyle} bg-[${theme.body}]`