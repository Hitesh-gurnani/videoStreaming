import { Request, Response } from "express";

export const uploadVideoController = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "No file uploaded" });
    return;
  }
  const videoPath = req.file.path;
  res.status(200).json({ success: true, message: "File uploaded", videoPath });
};
