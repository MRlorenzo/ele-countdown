export function clone( target ) {
  const isArray = Array.isArray(target);
  if (isArray){
    return Object.assign([] , target);
  }else if (typeof target === 'objcet'){
    return Object.assign({} , target);
  }
  return target;
}