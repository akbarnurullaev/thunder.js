import Thunder from "./Thunder"


const Button = new Thunder({
    tag: "button"
})
    .template`<div event-onclick="${props => props.onClick}">${props => props.label}</div>`

const Square = new Thunder({
    tag: "button"
}).style({
    width: "100px",
    height: "100px",
    backgroundColor: "red"
})
    .template`<div event-onmouseover="${props => props.onmouseover}">1</div>`



// Entry Point

new Thunder({
    tag: "main"
})
    .style({
        fontFamily: "sans-serif"
    })
    .template`
        <h1>Application</h1>
        ${Button.props({ label: "Click Me", onClick () {
            alert(100)
        }})}
        
        ${Square.props({
            onmouseover () {
                alert(100)
            }
        })}
    `
    .render("#root")
