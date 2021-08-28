export const validateNumber = (fieldValue = null, fieldName) => {
  // console.log(fieldValue);
  // console.log(typeof fieldValue);
  const value = parseInt(fieldValue);
  if (isNaN(value) || value <= 0 || !isItJustNumbers(fieldValue)) {
    throw new Error(
      `Invalid "${fieldName}" parameter. Must be a positive, non-zero integer.`
    );
  }

  return true;
};

export const validadeString = (fieldValue = null, fieldName) => {
  if (typeof fieldValue === 'string') {
    if (fieldValue.trim() === '' || isThereANumber(fieldValue)) {
      throw new Error(
        `Invalid "${fieldName}". Must be a string. No number allowed.`
      );
    }
    return true;
  } else if (typeof fieldValue !== 'string') {
    throw new Error(
      `Invalid "${fieldName}". Must be a string. No number allowed.`
    );
  }
};

const isItJustNumbers = (element) => {
  if (typeof element === 'string') {
    const splitted = element.split('');
    for (const index in splitted) {
      if (isNaN(parseInt(splitted[index]))) return false;
    }
  }
  return true;
};

const isThereANumber = (element) => {
  if (typeof element === 'string') {
    const splitted = element.split('');
    for (const index in splitted) {
      if (!isNaN(parseInt(splitted[index]))) {
        console.log(parseInt(splitted[index]));
        return true;
      }
    }
  }
  return false;
};
