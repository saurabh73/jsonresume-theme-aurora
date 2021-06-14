const dateFns = require('date-fns');
const totalWorkExp = function (date) {
  const startDate = dateFns.parse(date, 'yyyy-MM-dd', new Date());
  const diffInMonths = dateFns.differenceInMonths(new Date(), startDate);
  return dateFns.formatDuration({
    years: Math.floor(diffInMonths/12),
    months: diffInMonths%12
  });
};
export default totalWorkExp;