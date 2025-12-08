const modal = document.getElementById("projectModal");
const iframe = document.getElementById("projectFrame");

function openModal(url) {
    iframe.src = url;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.style.display = "none";
    iframe.src = ""; 
    document.body.style.overflow = "auto"; 
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});