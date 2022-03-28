import { Thunder } from "../../Thunder"

export const Headline = new Thunder({
    tag: "section",
})
    .style(() => ({
        borderBottom: "1px solid rgba(0,0,0,.2)",
        margin: "24px 0",
    }))
    .store(() => {
        const styles = {
            headline: {
                fontFamily: "sans-serif",
                marginBottom: "20px",
                fontWeight: "100",
            },
        }

        return { styles }
    }).template`
    <h1 
        style='${({ store }) => store.styles.headline}'
        on:click='${({ props }) => props?.onClick}'
    >
        ${({ props }) => props?.label}
    </h1>
`
