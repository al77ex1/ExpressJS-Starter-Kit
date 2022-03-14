/**
 * Convert options from string to array
 * @returns {Object}
 * @param options
 */
const convertOptions = (options) => {
  const parameters = options;
  if (parameters.order) {
    parameters.order = parameters.order.split(',');
    parameters.order = parameters.order.map((item) => {
      const order = item.split(':');
      order[1] = order[1].toUpperCase();
      return order;
    });
  } else {
    parameters.order = [];
  }
  return parameters;
};

module.exports = convertOptions;
