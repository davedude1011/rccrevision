import { bodyStyling, scrollBarStyle, theme } from "../style";

export default function Body() {
    const isMobile = window.innerWidth <= 640
    return (
        <div className={`${bodyStyling} ${isMobile ? "pt-8" : ""}`}>

        </div>
    )
}