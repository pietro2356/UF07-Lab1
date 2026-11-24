/**
 * Applies the specified style to the given element.
 *
 * @param {HTMLElement} element The element to apply the style to.
 * @param {object} style The style object containing CSS properties and values.
 *
 * @returns {void}
 */
export const applyStyleToElement = (element, style) => {
  Object.keys(style).forEach((key) => {
    if (isFunction(style[key])){
      element.style[key] = style[key]();
    }
    else{
      element.style[key] = style[key];
    }
  });
};

/**
 * Checks if a value is a function.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} True if the value is a function, false otherwise.
 */
export const isFunction = (value) => {
  return typeof value === "function";
};