import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
});

export default upload;
