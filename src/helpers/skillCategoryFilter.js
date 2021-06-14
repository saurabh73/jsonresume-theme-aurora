const _ = require('lodash');
const skillCategoryFilter = function (skills, category) {
  return _.chain(skills)
    .filter(i => (i.category === category))
    .uniq()
    .value();
};
export default skillCategoryFilter;