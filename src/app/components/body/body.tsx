import { bodyStyling, scrollBarStyle, theme } from "../style";
import { isMobile } from "react-device-detect"

export default function Body() {
    return (
        <div className={`${bodyStyling} ${isMobile ? "pt-8" : ""}`}>

        </div>
    )
}