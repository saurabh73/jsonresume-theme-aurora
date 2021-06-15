const dateFns = require('date-fns');
const _ = require('lodash');
const fileName = function (name) {
  return `${_.kebabCase(name)}-resume-${dateFns.formatISO(new Date(), { representation: 'date' })}`;
};
export default fileName;