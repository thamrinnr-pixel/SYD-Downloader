const formatButtons = document.querySelectorAll(".format");

const audioOptions = document.getElementById("audioOptions");
const videoOptions = document.getElementById("videoOptions");

const urlInput = document.getElementById("url");
const errorBox = document.getElementById("error");

const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultDetails = document.getElementById("resultDetails");

let selectedFormat = "mp3";

// PILIH FORMAT

formatButtons.forEach(button => {
    button.addEventListener("click", () => {

        formatButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        selectedFormat = button.dataset.format;

        const isVideo = selectedFormat === "mp4";

        audioOptions.classList.toggle("hidden", isVideo);
        videoOptions.classList.toggle("hidden", !isVideo);

        result.classList.add("hidden");
        errorBox.textContent = "";
    });
});

// PASTE LINK

document.getElementById("pasteBtn").addEventListener("click", async () => {

    try {
        const text = await navigator.clipboard.readText();

        if (text) {
            urlInput.value = text.trim();
        }

        errorBox.textContent = "";

    } catch (error) {

        errorBox.textContent =
            "Clipboard tidak tersedia. Tempel link secara manual.";

    }

});

// ANALISIS LINK

document.getElementById("analyzeBtn").addEventListener("click", () => {

    errorBox.textContent = "";

    const rawUrl = urlInput.value.trim();

    let parsedUrl;

    try {

        parsedUrl = new URL(rawUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid URL");
        }

    } catch {

        errorBox.textContent = "Masukkan link URL yang valid.";

        result.classList.add("hidden");

        return;
    }

    const host = parsedUrl.hostname
        .replace(/^www\./, "");

    const audioQuality =
        document.getElementById("audioQuality").value;

    const videoQuality =
        document.getElementById("videoQuality").value;

    const videoRatio =
        document.getElementById("videoRatio").value;

    // DATA FORMAT

    const details = [];

    details.push(
        "FORMAT: " + selectedFormat.toUpperCase()
    );

    if (selectedFormat === "mp4") {

        details.push(
            "RESOLUSI: " +
            (videoQuality === "best"
                ? "Terbaik tersedia"
                : videoQuality + "p")
        );

        details.push(
            "RASIO: " + videoRatio
        );

    } else {

        details.push(
            "KUALITAS: " +
            (audioQuality === "source"
                ? "Terbaik tersedia"
                : audioQuality + " kbps")
        );

    }

    details.push("SUMBER: " + host);

    // TAMPILKAN HASIL

    resultDetails.replaceChildren();

    details.forEach(item => {

        const div = document.createElement("div");

        div.textContent = "• " + item;

        div.style.padding = "6px 0";
        div.style.fontSize = "12px";
        div.style.color = "#ff7789";

        resultDetails.appendChild(div);

    });

    resultText.textContent =
        "Pengaturan berhasil disiapkan. Backend belum terhubung.";

    result.classList.remove("hidden");

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});
// =================================
// S.Y.D AUDIO FILE HANDLER
// =================================

const audioInput = document.getElementById("audioFile");
const fileInfo = document.getElementById("fileInfo");
const errorMessage = document.getElementById("error");

let selectedAudio = null;
let audioPreviewURL = null;

if (audioInput) {
  audioInput.addEventListener("change", () => {
    const file = audioInput.files[0];

    if (audioPreviewURL) {
      URL.revokeObjectURL(audioPreviewURL);
      audioPreviewURL = null;
    }

    selectedAudio = null;

    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      errorMessage.textContent = "File harus berupa audio!";
      fileInfo.textContent = "Silakan pilih file audio.";
      audioInput.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      errorMessage.textContent = "Ukuran maksimal file adalah 100 MB.";
      audioInput.value = "";
      return;
    }

    selectedAudio = file;
    errorMessage.textContent = "";

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    fileInfo.textContent =
      `Nama: ${file.name} | Ukuran: ${sizeMB} MB`;

    audioPreviewURL = URL.createObjectURL(file);

    let preview = document.getElementById("audioPreview");

    if (!preview) {
      preview = document.createElement("audio");
      preview.id = "audioPreview";
      preview.controls = true;
      preview.style.width = "100%";
      preview.style.marginTop = "12px";
      fileInfo.after(preview);
    }

    preview.src = audioPreviewURL;
  });
            }
        
