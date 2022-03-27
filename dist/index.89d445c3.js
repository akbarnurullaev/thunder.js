class Thunder {
    constructor({ tag , attributes  }){
        this.element = document.createElement(tag);
        if (attributes) for (const [key, value] of Object.entries(attributes))this.element.setAttribute(key, value);
    }
    render(to) {
        document.querySelector(to).appendChild(this.element);
    }
}

//# sourceMappingURL=index.89d445c3.js.map
