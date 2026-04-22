/**
 * Compresses an image file using HTML5 Canvas to a target size.
 * @param file The original image file
 * @param maxSizeMB Target maximum size in MB (e.g., 2 for 2MB)
 * @param maxWidth Target max width in pixels (default: 1920 to keep good desktop details)
 * @returns A File object of the compressed image
 */
export async function compressImage(file: File, maxSizeMB: number = 2, maxWidth: number = 1920): Promise<File> {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    // If the file is already small enough and not too large in dimensions, we could theoretically just return it,
    // but running it through compression ensures optimal format and dimensions.
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        
        reader.onerror = (e) => reject(e);
        
        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Attempt compression starting at high quality
            let quality = 0.9;
            const targetFormat = 'image/jpeg'; // JPEG generally provides better compression for photos
            
            const attemptCompression = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob failed'));
                            return;
                        }
                        
                        // If blob is under max size or we've reduced quality as much as reasonable (0.5), resolve
                        if (blob.size <= maxSizeBytes || quality <= 0.5) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                                type: targetFormat,
                                lastModified: Date.now(),
                            });
                            resolve(newFile);
                        } else {
                            // Otherwise, reduce quality and try again
                            quality -= 0.1;
                            attemptCompression();
                        }
                    },
                    targetFormat,
                    quality
                );
            };
            
            attemptCompression();
        };
        
        reader.readAsDataURL(file);
    });
}
