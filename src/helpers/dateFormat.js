const dateFns = require('date-fns');
const dateFormat = function (date, dateformat) {
  return dateFns.format(dateFns.parse(date, 'yyyy-MM-dd', new Date()), dateformat);
};
export default dateFormat;