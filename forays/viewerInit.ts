import {ImageViewer} from "../components/imageViewer.js";

const viewer = document.querySelector("image-viewer") as ImageViewer;
viewer.srcList = viewer.globImageSrcs();

for(const img of  document.querySelectorAll("img"))
	img.addEventListener("click", () => {
		viewer.openAt(img.src)
	});
