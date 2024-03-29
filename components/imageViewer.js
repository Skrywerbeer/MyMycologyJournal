const ImageViewerTemplate = document.createElement("template");
ImageViewerTemplate.innerHTML = `
<style>
  :host {
	  display: flex;
	  position: fixed;
	  width: 100vw;
	  height: 100vh;
	  justify-content: space-around;
	  align-items: center;
	  background: #333333e0;
  }

  img {
	  width: 80vw;
	  height: 80vh;
	  object-fit: contain;
  }

slot[name="closeButton"]::slotted(*) {
position: absolute;
top: 80px;
right: 80px;
color: white;
  }
</style>

<slot name="prevButton"></slot>
<img src="" alt="" part="image"></img>
<slot name="nextButton"></slot>
<slot name="closeButton"><p>❌</p></slot>
`;
export class ImageViewer extends HTMLElement {
    static observedAttributes = ["srcList", "circular"];
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._internals = this.attachInternals();
        (this.shadowRoot).append(ImageViewerTemplate.content.cloneNode(true));
        ((this.shadowRoot).querySelector("[name='prevButton']"))
            .addEventListener("click", (event) => {
            this.previous();
        });
        ((this.shadowRoot).querySelector("[name='nextButton']"))
            .addEventListener("click", (event) => {
            this.next();
        });
        ((this.shadowRoot).querySelector("[name='closeButton']"))
            .addEventListener("click", (event) => {
            this.close();
        });
    }
    connectedCallback() {
        this.parseSrcListAttr();
        this.close();
    }
    disconnectedCallback() {
        document.removeEventListener("keyup", this.escHandler);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case ("srcList"):
                this.parseSrcListAttr();
                break;
        }
    }
    get srcList() {
        return this.getAttribute("srcList");
    }
    set srcList(list) {
        this.setAttribute("srcList", list.toString());
        this.srcArray = list;
        if (this.index > (this.srcArray.length - 1))
            this.index = (this.srcArray.length - 1);
        this.current();
    }
    open() {
        this.current();
        this.style.visibility = "visible";
        document.addEventListener("keyup", this.escHandler);
    }
    openAt(index) {
        console.log(`open at: ${index}`);
        if (!index)
            throw new Error(`image-viewer: Index (${index})`);
        if (typeof index === "number") {
            if ((index < 0) || (index > (this.srcArray.length - 1)))
                throw new Error(`image-viewer: Index (${index})out of bounds.`);
            this.index = index;
        }
        else if (typeof index === "string") {
            const indexOf = this.srcArray.indexOf(index);
            if (indexOf === -1)
                throw new Error(`image-viewer: Could not find (${index}) in srcList`);
            this.index = indexOf;
            this.current();
            this.open();
        }
    }
    close() {
        this.style.visibility = "hidden";
        document.removeEventListener("keyup", this.escHandler);
    }
    next() {
        const TOP = this.srcArray.length - 1;
        if (this.srcArray.length === 0)
            return;
        if (this.index === TOP)
            return;
        this.index++;
        this.current();
    }
    previous() {
        if (this.srcArray.length === 0)
            return;
        if (this.index === 0)
            return;
        this.index--;
        this.current();
    }
    current() {
        this.setImage(this.srcArray[this.index]);
    }
    setImage(url) {
        ((this.shadowRoot).querySelector("img")).src = url;
    }
    parseSrcListAttr() {
        this.srcArray = ((this.getAttribute("srcList")) ?? "")
            .match(/([\/\.0-9A-Za-z_])+.jpg/g) ?? [];
    }
    escHandler = (event) => {
        if (event.key === "Escape")
            this.close();
    };
    srcArray = new Array();
    index = 0;
    _internals;
}
customElements.define("image-viewer", ImageViewer);
