
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, crypto.randomUUID() + ext);
  }
});

const allowed = new Set([
  ".mp3", ".m4a", ".mp4", ".wav", ".mov"
]);

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.has(ext));
  }
});

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    name: "S.Y.D Downloader",
    status: "online"
  });
});

app.post("/api/upload", upload.single("media"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File tidak valid atau belum dipilih."
    });
  }

  res.json({
    success: true,
    message: "File berhasil diterima.",
    filename: req.file.filename
  });
});

app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message || "Upload gagal."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`S.Y.D Downloader berjalan di port ${PORT}`);
});
  
