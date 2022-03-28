import { Thunder } from "../../Thunder"

export const Button = new Thunder({
    tag: "button",
}).style((props) => ({
    background: props.background,
    padding: "16px 12px",
    borderRadius: "6px",
    color: "white",
    border: "none",
})).template`
    <div 
        on:click='${({ props }) => props?.onClick}'>
        ${({ props }) => props?.caption}
    </div>
    `
