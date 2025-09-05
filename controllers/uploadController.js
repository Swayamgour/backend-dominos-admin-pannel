import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload image buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "my_uploads" }, // optional folder
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary Error", error });
        }
        return res.status(200).json({
          message: "Image uploaded successfully",
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Pipe the file buffer to Cloudinary upload stream
    result.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
