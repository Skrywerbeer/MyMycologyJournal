const viewer = document.querySelector("image-viewer");
viewer.srcList = viewer.globImageSrcs();
for (const img of document.querySelectorAll("img"))
    img.addEventListener("click", () => {
        viewer.openAt(img.src);
    });
export {};
