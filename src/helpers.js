/**
 * Helper function that
 * redirects the window to
 * the inserted path
 *
 * @param {*} path
 */
export const redirectTo = function (path) {
  window.location.href = path;
};

/**
 * Helper function that takes an integer or string number as argument and
 * returns a thousand separated by comma string of the same number
 *
 * @param {*} value
 * @returns {string}
 */
export const commatize = function (value) {
  return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
  // return value.toLocaleString();
};

/**
 * Helper Function that assigns a deep cloned array to a variable
 *
 * @param {array} array
 */
export const deepCloneArray = function (array) {
  return JSON.parse(JSON.stringify(array));
};

/**
 * Helper function which excludes a given string from a string array
 *
 * @param {*} array
 * @param {*} string
 * @returns
 */
export const filterOutStringFromArray = function (array, string) {
  return array.filter((item) => {
    return item !== string;
  });
};

/**
 * Function that returns
 * the first word found in a string.
 * @param {*} str
 * @returns
 */
export const getFirstWord = function (str) {
  let spaceIndex = str.indexOf(" ");
  return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
};

/**
 * Helper function that filters an array to find an
 * object with the same key and value as the ones inserted
 *
 * @param {*} array
 * @param {*} item_key
 * @param {*} key
 * @param {*} item_value
 * @param {*} value
 * @returns {boolean}
 */
const findObjectInArray = function (array, item_key, key, item_value, value) {
  let tempArray = array.filter((item) => {
    let itemKey = item[item_key];
    let itemValue = item[item_value];
    if (itemKey === key && itemValue === value) {
      return item;
    }
  });
  if (tempArray && tempArray.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Helper function that checks if an integer
 * exists in array object
 * @param {number} value
 * @param {Array} array
 * @param {string} elementKey
 * @returns
 */
export const isInArray = function (value, array, elementKey) {
  if (typeof array !== undefined && array) {
    if (array.length > 0) {
      const map = array.filter((elem) => {
        if (parseInt(elem[elementKey]) === value) {
          return true;
        }
      });
      if (map.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * Helper function that returns a boolean
 * value, true or false whether the number
 * passed to it was an odd number or not,
 * respectively.
 *
 * @param {*} number
 * @returns
 */
export const isOdd = function (number) {
  let odd = number % 2 === 1;
  if (odd) {
    return "odd";
  } else {
    return "even";
  }
};

export const addToArray = function (array, value) {
  let temp = deepCloneArray(array);
  temp.push(value);
  return temp;
};

/**
 *  Helper function that returns an array of each
 *  unique value found on the inserted array for a
 *  specific key
 *
 * @param {array} array
 * @param {string} key
 * @returns {array} results
 */
export const filterArrayForUniqueKeyValues = function (array, nest, key, key2) {
  let tempArray = [];
  array.filter((item) => {
    let itemKeyValue;
    if (nest) {
      itemKeyValue = item[nest][key];
    } else {
      itemKeyValue = item[key];
    }
    if (itemKeyValue && !tempArray.includes(itemKeyValue)) {
      if (!key2) {
        tempArray.push(itemKeyValue);
      } else {
        //second key exists
        let itemKey;
        if (nest) {
          itemKey = item[nest][key2];
          if (
            itemKey &&
            !findObjectInArray(tempArray, "key", itemKey, "value", itemKeyValue)
          ) {
            tempArray.push({ key: itemKey, value: itemKeyValue });
          } else if (
            !findObjectInArray(tempArray, "key", itemKey, "value", itemKeyValue)
          ) {
            tempArray.push({ key: itemKeyValue, value: itemKeyValue });
          }
        } else {
          itemKey = item[key2];
          if (
            itemKey &&
            !findObjectInArray(tempArray, "key", itemKey, "value", itemKeyValue)
          ) {
            tempArray.push({ key: itemKey, value: itemKeyValue });
          } else if (
            !findObjectInArray(tempArray, "key", itemKey, "value", itemKeyValue)
          ) {
            tempArray.push({ key: itemKeyValue, value: itemKeyValue });
          }
        }
      }
    }
  });
  return tempArray;
};
/**
 * usePrevious react hook helper
 *
 * @param {*} value
 * @returns
 */
// export const usePrevious = function (value) {
//   const ref = React.useRef();
//   React.useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };
