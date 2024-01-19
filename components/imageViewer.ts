const ImageViewerTemplate = document.createElement("template");
ImageViewerTemplate.innerHTML = `
<style>
  :host {
	  display: flex;
	  position: absolute;
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
<img src=""></img>
<slot name="nextButton"></slot>
<slot name="closeButton"><p>❌</p></slot>
`

class ImageViewer extends HTMLElement {
	static observedAttributes = ["srcList", "circular"];
	constructor() {
		super();
		this.attachShadow({mode: "open"});
		this._internals = this.attachInternals();
		(this.shadowRoot!).append(ImageViewerTemplate.content.cloneNode(true));
		((this.shadowRoot!).querySelector("[name='prevButton']")!)
			.addEventListener("click", (event) => {
				this.previous();
			});
		((this.shadowRoot!).querySelector("[name='nextButton']")!)
			.addEventListener("click", (event) => {
				this.next();
			});
		((this.shadowRoot!).querySelector("[name='closeButton']")!)
			.addEventListener("click", (event) => {
				this.close();
			});
	}
	connectedCallback() {
		// TODO better regExp for other formats.
		this.parseSrcListAttr();
		this.close();
	}
	disconnectedCallback() {
		document.removeEventListener("keyup", this.escHandler);
	}
	attributeChangedCallback(name: any, oldValue: any, newValue: any) {
		switch (name) {
			case ("srcList"):
				this.parseSrcListAttr();
				break;
		}
	}
	globImageSrcs(): Array<string> {
		const ret = new Array();
		for (const img of document.querySelectorAll("img"))
			ret.push(img.src);
		return ret;;
	}
	get srcList(): string {
		return this.getAttribute("srcList")!;
	}
	set srcList(list: Array<string>) {
		this.setAttribute("srcList", list.toString());
		this.srcArray = list;
		if (this.index > (this.srcArray.length - 1))
			this.index = (this.srcArray.length - 1)
		this.current();
	}

	open(): void {
		this.current();
		this.style.visibility = "visible";
		document.addEventListener("keyup", this.escHandler);
	}
	openAt(index: number): void {
		this.index= index;
	}
	close(): void {
		this.style.visibility = "hidden";
		document.removeEventListener("keyup", this.escHandler);
	}
	next(): void {
		const TOP = this.srcArray.length - 1
		if (this.srcArray.length === 0)
			return;
		if (this.index === TOP)
			return;
		this.index++;
		// if (this.index === TOP); // TODO: set state end.
		this.current();
	}
	previous(): void {
		if (this.srcArray.length === 0)
			return;
		if (this.index === 0)
			return;
		this.index--;
		// if (this.index === 0); // TODO: set state begining.
		this.current();
	}
	private current(): void {
		this.setImage(this.srcArray[this.index]);
	}
	private setImage(url: string) {
		this.shadowRoot.querySelector("img").setAttribute("src", url);
	}
	private parseSrcListAttr(): void {
		this.srcArray = this.getAttribute("srcList").match(/([\/\.0-9A-Za-z_])+.jpg/g);
	}
	private escHandler = (event: KeyboardEvent) => {
		if (event.key === "Escape")
			this.close();
	}
	private srcArray: Array<string> = new Array();
	index: number = 0;
}

customElements.define("image-viewer", ImageViewer);