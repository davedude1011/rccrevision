import { bodyStyling, scrollBarStyle, theme } from "../style";

export default function Body() {
    return (
        <div className={`${bodyStyling} ${window.innerWidth <= 640 ? "pt-8" : ""}`}>

        </div>
    )
}