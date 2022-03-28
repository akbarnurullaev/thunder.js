const ThunderKeyWords = {
    event: "on:",
}

class ThunderUtils {
    static camelToSnakeCase(str) {
        return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    }
}

export class Thunder {
    __TEMPLATE_CACHE__ = null

    __STORE__ = null
    __PROPS__ = null

    __STYLES_FN__ = null
    __EVENTS_FN__ = null

    constructor({ tag, attributes }) {
        this.element = document.createElement(tag)

        /* Adding attributes to parent element */
        if (attributes) {
            for (const [key, value] of Object.entries(attributes)) {
                this.element.setAttribute(key, value)
            }
        }
    }

    #PROPS_INITIALIZED() {
        // Apply Styles
        this.#APPLY_STYLES()

        // Apply Events
        // this.#APPLY_EVENTS()
    }

    #APPLY_STYLES() {
        const CSSObject = this.__STYLES_FN__(this.__PROPS__)

        for (const [key, value] of Object.entries(CSSObject)) {
            this.element.style[key] = value
        }
    }

    // #APPLY_EVENTS() {
    //     if (typeof this.__EVENTS_FN__ === "function") {
    //         const EVTObject = this.__EVENTS_FN__(this.__PROPS__)

    //         for (const [name, callback] of Object.entries(EVTObject)) {
    //             this.element.addEventListener(name, callback)
    //         }
    //     }
    // }

    store(storeReducer) {
        this.__STORE__ = storeReducer()
        return this
    }

    // bindEvents(EventsFN) {
    //     this.__EVENTS_FN__ = EventsFN
    //     return this
    // }

    style(StyleFN) {
        this.__STYLES_FN__ = StyleFN
        return this
    }

    props(propsObject) {
        /* Initializing Properties */
        this.__PROPS__ = propsObject
        const { literals, values } = this.__TEMPLATE_CACHE__

        /* Calling Template function to re-render */
        this.template(literals, ...values)

        /* Call Props Init Hook */
        this.#PROPS_INITIALIZED()

        /* Returning the whole HTML Element as a string */
        return this.element.outerHTML
    }

    template(literals, ...values) {
        let result = "",
            stylesProxy = null

        if (!this.__TEMPLATE_CACHE__) {
            this.__TEMPLATE_CACHE__ = {
                literals,
                values,
            }
        }

        if (this.__STORE__?.styles) {
            stylesProxy = new Proxy(this.__STORE__.styles, {
                get(target, key) {
                    const { camelToSnakeCase } = ThunderUtils,
                        result = []

                    for (const [property, value] of Object.entries(
                        target[key]
                    )) {
                        result.push(`${camelToSnakeCase(property)}:${value}`)
                    }

                    return result.join(";")
                },
            })
        }

        const { literals: TCacheLiterals, values: TCacheValues } =
            this.__TEMPLATE_CACHE__

        for (let i = 0; i < TCacheLiterals.length; i++) {
            /* Check for initial state */
            if (i > 0) {
                const target = TCacheValues[i - 1]

                /* Check passed value if that's function */
                if (typeof target === "function") {
                    result += target({
                        store: {
                            ...this.__STORE__,
                            styles: stylesProxy ?? null,
                        },
                        props: this.__PROPS__ ?? null,
                    })
                } else {
                    // Passing target value by default
                    result += target
                }
            }

            /* Adding current literal */
            result += TCacheLiterals[i]
        }

        /* Adding template into cache */
        this.__TEMPLATE_CACHE__.template = result
            .replace(/(\r\n|\n|\r)/gm, "")
            .trim()

        const { template: TCacheTemplate } = this.__TEMPLATE_CACHE__

        this.element.innerHTML = TCacheTemplate

        return this
    }

    get __html__() {
        return this.element.outerHTML
    }
}

export class ThunderDOM {
    __ROOT_SELECTOR__ = null
    __ROOT_ELEMENT__ = null

    constructor({ root }) {
        this.__ROOT_SELECTOR__ = root
        this.__ROOT_ELEMENT__ = document.querySelector(this.__ROOT_SELECTOR__)
    }

    #bindEvents() {
        for (const element of this.__ROOT_ELEMENT__.getElementsByTagName("*")) {
            let events = element
                .getAttributeNames()
                .filter((attr) => attr.startsWith(ThunderKeyWords.event))
                .map((event) => ({
                    body: element.getAttribute(event),
                    name: event,
                }))

            if (events.length > 0) {
                events.forEach(({ name, body }) => {
                    element.addEventListener(
                        name.replace(ThunderKeyWords.event, ""),
                        (e) => new Function(`return ${body}`)()(e)
                    )
                })
            }
        }
    }

    #removeThunderAttributes() {
        for (const element of this.__ROOT_ELEMENT__.getElementsByTagName("*")) {
            element.removeAttribute("on:click")
        }
    }

    render(ThunderNode) {
        /* Get HTML of Thunder Instance */
        const NodeHTML = ThunderNode.__html__

        document.querySelector(this.__ROOT_SELECTOR__).innerHTML = NodeHTML

        this.#bindEvents()

        this.#removeThunderAttributes()
    }
}
