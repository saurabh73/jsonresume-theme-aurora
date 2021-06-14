const _ = require('lodash');
const skillCategory = function (skills) {
  return _.chain(skills)
    .map(i => i.category)
    .uniq()
    .value();
};
export default skillCategory;