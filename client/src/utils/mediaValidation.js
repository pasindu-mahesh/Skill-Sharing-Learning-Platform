export const validateMediaFiles = (files) => {
    if (files.length > 3) return { valid: false, message: "Max 3 files allowed." };
  
    for (let file of files) {
      const type = file.type;
  
      if (!type.startsWith("image/") && !type.startsWith("video/")) {
        return { valid: false, message: "Only images or short videos allowed." };
      }
  
      const maxSize = 10 * 1024 * 1024; // 10 MB per file
      if (file.size > maxSize) {
        return { valid: false, message: "Each file must be less than 10MB." };
      }
    }
  
    return { valid: true };
  };
  