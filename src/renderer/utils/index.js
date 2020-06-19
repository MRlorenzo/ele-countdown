export function clone( target ) {
  const isArray = Array.isArray(target);
  if (isArray){
    return Object.assign([] , target);
  }else if (typeof target === 'objcet'){
    return Object.assign({} , target);
  }
  return target;
}

//将图片转换为base64
export function getBase64Image(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  let dataURL = canvas.toDataURL("image/png");
  return dataURL
}