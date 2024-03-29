import {ImageViewer} from "../components/imageViewer.js";

const viewer = document.querySelector("image-viewer") as ImageViewer;


const urls = new Array();
for (const img of document.querySelectorAll("img")) {
	const url = img.src.replace("-thumb", "")
	urls.push(url);
	img.addEventListener("click", () => {
		viewer.openAt(url);
	});
}
viewer.srcList = urls;
