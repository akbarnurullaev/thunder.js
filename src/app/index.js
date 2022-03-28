import { Thunder } from "../Thunder"

// Components
import { Headline, Button } from "../components"

export const App = new Thunder({
    tag: "main",
}).store(() => {
    const events = {
        onHeadlineClick: () => {
            alert("Yup, there we go !")
        },

        onButtonClick: (e) => {
            alert("I can handle E: ", e?.target?.value)
        },
    }

    return { events }
}).template`
    ${({ store }) =>
        Headline.props({
            label: "ThunderJS Fucks",
            onClick: store.events.onHeadlineClick,
        })}

    ${({ store }) =>
        Button.props({
            caption: "Click me to show alert",
            onClick: store.events.onButtonClick,
            background: "#e13131",
        })}

    ${({ store }) =>
        Button.props({
            caption: "Another Button",
            onClick: store.events.onButtonClick,
            background: "blue",
        })}
`
