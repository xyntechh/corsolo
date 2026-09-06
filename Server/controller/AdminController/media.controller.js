const fs = require("fs");
const path = require("path");
const uploadPath = path.join(__dirname, "../../uploads");


exports.getAllMedia = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 10;

    const files = fs.readdirSync(uploadPath);

    // Newest files first
    files.sort((a, b) => {
      const timeA = parseInt(a.split("-")[0]) || 0;
      const timeB = parseInt(b.split("-")[0]) || 0;

      return timeB - timeA;
    });

    const total = files.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const paginatedFiles = files.slice(startIndex, startIndex + limit);

    const media = paginatedFiles.map((file) => ({
      name: file,
      url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
    }));

    return res.status(200).json({
      success: true,
      count: media.length,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      media,
    });

  } catch (error) {
    console.error("getAllMedia:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get media",
    });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { filenames } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one filename is required",
      });
    }

    const results = [];

    for (const filename of filenames) {
      // Security: sirf filename allow karo
      const safeFilename = path.basename(filename);

      if (safeFilename !== filename) {
        results.push({
          filename,
          success: false,
          message: "Invalid filename",
        });
        continue;
      }

      const filePath = path.join(uploadPath, safeFilename);

      try {
        await fs.promises.unlink(filePath);

        results.push({
          filename: safeFilename,
          success: true,
        });
      } catch (error) {
        if (error.code === "ENOENT") {
          results.push({
            filename: safeFilename,
            success: false,
            message: "File not found",
          });
        } else {
          throw error;
        }
      }
    }

    const deleted = results.filter((item) => item.success).length;
    const failed = results.filter((item) => !item.success).length;

    return res.status(200).json({
      success: true,
      message: `${deleted} file(s) deleted successfully`,
      deleted,
      failed,
      results,
    });

  } catch (error) {
    console.error("deleteMedia:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete media",
    });
  }
};