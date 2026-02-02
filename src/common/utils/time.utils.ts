import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../../assets/other/en-in';

export const getTimeAgo = (time: Date) => {
  dayjs.locale('en-in');
  const diffTime = dayjs().diff(time, 'day');
  if (diffTime > 7) {
    return dayjs(time).format('MMM D, YYYY');
  }
  dayjs.extend(relativeTime);

  return dayjs(time).fromNow();
};
