import 'dayjs/locale/ar-sa';

import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

export type Date = dayjs.Dayjs;

const date: typeof dayjs = dayjs;

date.extend(isSameOrAfter);
date.extend(isSameOrBefore);
date.extend(utc);
date.extend(timezone);

date.locale('ar-sa');
date.tz.setDefault('Asia/Riyadh');

export default date;

export const now: () => Date = () => date();

export const nowTimestamp = () => now().format('YYYY-MM-DD HH:mm:ss.SSS000');
