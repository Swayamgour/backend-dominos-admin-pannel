import multer from "multer";

// memory storage → keeps file in buffer
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;


