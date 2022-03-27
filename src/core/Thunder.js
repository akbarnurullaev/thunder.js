class Thunder {
    constructor({ tag, attributes }) {
        this.element = document.createElement(tag)

        if (attributes) {
            for ( const [key, value] of Object.entries(attributes) ) {
                this.element.setAttribute(key, value)
            }
        }
    }

    __bind_events () {
        const children = this.element.children;

        if (children) {
            for ( let i = 0; i < children.length; i++ ) {

                const target = children[i],
                    events = target.getAttributeNames().filter(event => event.startsWith("event"));

                if (events.length) {
                    for ( let event of events ) {
                        target.removeAttribute(event);

                        target.addEventListener("click", () => {
                            console.log("19")
                        })
                    }
                }
            }
        }
    }

    props(propsObject) {
        this._PROPS_ = propsObject;

        const { literals, values } = this._TEMPLATE_CACHE_;
        this.template(literals, ...values)

        this.__bind_events()

        return this.element.outerHTML
    }

    template(literals, ...values) {
        let result = ""

        if ( !this._TEMPLATE_CACHE_ ) {
            this._TEMPLATE_CACHE_ = {
                literals,
                values
            }
        }

        for ( let i = 0; i < this._TEMPLATE_CACHE_.literals.length; i++ ) {
            if ( i > 0 ) {
                const target = this._TEMPLATE_CACHE_.values[i - 1];

                if (typeof target === "function") {
                    if ( this._PROPS_ ) {
                        result += target(this._PROPS_)
                    }
                } else {
                    result += target;
                }
            }

            result += this._TEMPLATE_CACHE_.literals[i]
        }

        this._TEMPLATE_ = result;

        this.element.innerHTML = this._TEMPLATE_;
        this.__bind_events()

        return this
    }


    style(CSSObject) {
        for ( const [key, value] of Object.entries(CSSObject) ) {
            this.element.style[key] = value;
        }

        return this
    }

    render(to) {
        document.querySelector(to).appendChild(this.element)
    }
}

export default Thunder
