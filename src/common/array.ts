export const removeExists = (list: any, item: any) => {
  const index = list?.indexOf(item);
  if (index > -1) {
    list.splice(index, 1);
  }
};

const ArrayUtils = {
  removeExists,
};

export default ArrayUtils;
