export const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL('image/png');
};

export const base64ToCanvas = (
  base64: string, 
  canvas: HTMLCanvasElement,
  callback?: () => void
): void => {
  const img = new Image();
  img.onload = () => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      if (callback) callback();
    }
  };
  img.src = base64;
};

export const createThumbnail = (
  canvas: HTMLCanvasElement, 
  width: number = 128, 
  height: number = 128
): string => {
  const thumbnailCanvas = document.createElement('canvas');
  thumbnailCanvas.width = width;
  thumbnailCanvas.height = height;
  
  const ctx = thumbnailCanvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, width, height);
  }
  
  return thumbnailCanvas.toDataURL('image/png');
};

export const exportAsMinecraftSkin = (canvas: HTMLCanvasElement): void => {
  const link = document.createElement('a');
  link.download = 'minecraft-skin.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};