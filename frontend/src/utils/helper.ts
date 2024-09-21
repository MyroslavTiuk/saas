import moment from 'moment';
const WORKING_DAY_SECONDS = 7 * 3600 + 21 * 60;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateDeviceProductKey() {
  const tokens = '0123456789';
  const chars = 5;
  const segments = 4;
  let keyString = '';

  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < chars; j++) {
      const k = getRandomInt(0, 9);
      segment += tokens[k];
    }
    keyString += segment;
    if (i < segments - 1) {
      keyString += '-';
    }
  }
  return keyString;
}

export function calculateAge(birthday: Date) {
  return new Date().getFullYear() - birthday.getFullYear();
}

export function normalizeReportName(name_report: string) {
  const name = (name_report || '').split(', ');
  name.reverse();
  return name.join(' ');
}

export function getWorkedHours(clock_in: string, clock_out: string) {
  if (!clock_in || !clock_out) {
    return '';
  }
  const inSeconds = HMSToSeconds(clock_in);
  const outSeconds = HMSToSeconds(clock_out);
  const differenceSeconds = outSeconds - inSeconds;
  if (differenceSeconds < 0) {
    return '';
  }
  return secondsToHMS(differenceSeconds);
}

export function HMSToSeconds(hms: string) {
  const parts = hms.split(':');
  return +parts[0] * 60 * 60 + +parts[1] * 60 + +parts[2];
}

export function secondsToHMS(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

export function toHoursAndMinutesAndSeconds(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}

export function getClockIn(date, rowsDates) {
  const info = rowsDates[date.format('YYYY-MM-DD')];
  if (!info) {
    return '-';
  }
  return info.clocked_in ? moment(info.clocked_in, 'hh:mm:ss').format('hh:mm:ss A') : '-';
}

export function getClockOut(date, rowsDates) {
  const info = rowsDates[date.format('YYYY-MM-DD')];
  if (!info) {
    return '-';
  }
  return info.clocked_out ? moment(info.clocked_out, 'hh:mm:ss').format('hh:mm:ss A') : '-';
}

export function calculateDailyWeekEnd(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date.format('YYYY-MM-DD')];
  const isWeekend = date.day() % 6 === 0;
  if (dateInfo && isWeekend) {
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    // check launch time
    const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
    const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
    if (clock_in < 12 && clock_out > 12) {
      workingSeconds -= 3600;
    }
    total += workingSeconds;
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyHoursWorked(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date.format('YYYY-MM-DD')];
  if (dateInfo) {
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    const workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      total += workingSeconds;
    }
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyActualHours(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date.format('YYYY-MM-DD')];
  if (dateInfo) {
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
      const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
      if (clock_in < 12 && clock_out > 12) {
        workingSeconds -= 3600;
      }
      total += workingSeconds;
    }
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyUnderTime(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date.format('YYYY-MM-DD')];
  const isWeekend = date.day() % 6 === 0;
  if (dateInfo && !isWeekend) {
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
      const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
      if (clock_in < 12 && clock_out > 12) {
        workingSeconds -= 3600;
      }
      if (workingSeconds < WORKING_DAY_SECONDS) {
        total += WORKING_DAY_SECONDS - workingSeconds;
      }
    } else {
      total += WORKING_DAY_SECONDS;
    }
  } else {
    if (!isWeekend) {
      total += WORKING_DAY_SECONDS;
    }
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyOverTime(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date.format('YYYY-MM-DD')];
  const isWeekend = date.day() % 6 === 0;
  if (dateInfo && !isWeekend) {
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
      const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
      if (clock_in < 12 && clock_out > 12) {
        workingSeconds -= 3600;
      }
      if (workingSeconds > WORKING_DAY_SECONDS) {
        total += workingSeconds - WORKING_DAY_SECONDS;
      }
    }
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodWorkedTimes(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isWeekend = date.day() % 6 === 0;
    if (isWeekend) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (!dateInfo) {
      return;
    }
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    const workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds === 0) return; // Ignore clock out not available
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodActualHours(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isWeekend = date.day() % 6 === 0;
    if (isWeekend) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (!dateInfo) {
      return;
    }
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds === 0) return; // Ignore clock out not available
    const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
    const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
    if (clock_in < 12 && clock_out > 12) {
      workingSeconds -= 3600;
    }
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodUnderTime(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isWeekend = date.day() % 6 === 0;
    if (isWeekend) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (dateInfo) {
      const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
      let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
      if (workingSeconds > 0) {
        // check launch time
        const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
        const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
        if (clock_in < 12 && clock_out > 12) {
          workingSeconds -= 3600;
        }
        if (workingSeconds < WORKING_DAY_SECONDS) {
          total += WORKING_DAY_SECONDS - workingSeconds;
        }
      } else {
        total += WORKING_DAY_SECONDS;
      }
    } else {
      total += WORKING_DAY_SECONDS;
    }
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodOverTime(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isWeekend = date.day() % 6 === 0;
    if (isWeekend) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds === 0) return;
    // check launch time
    const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
    const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
    if (clock_in < 12 && clock_out > 12) {
      workingSeconds -= 3600;
    }
    if (workingSeconds > WORKING_DAY_SECONDS) {
      total += workingSeconds - WORKING_DAY_SECONDS;
    }
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodSaturdayHours(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isSaturday = date.day() === 6; // Saturday
    if (!isSaturday) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    const workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodSundayHours(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isSunday = date.day() === 0; // Sunday
    if (!isSunday) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
    const workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePayDockingDays(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isWeekend = date.day() % 6 === 0;
    if (isWeekend) return;
    const dateInfo = rowDates[date.format('YYYY-MM-DD')];
    if (dateInfo) {
      const d = moment(dateInfo.worked_hours, 'hh:mm:ss');
      let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
      if (workingSeconds > 0) {
        // check launch time
        const clock_in = moment(dateInfo.clocked_in, 'HH').hours();
        const clock_out = moment(dateInfo.clocked_out, 'HH').hours();
        if (clock_in < 12 && clock_out > 12) {
          workingSeconds -= 3600;
        }
        if (workingSeconds < WORKING_DAY_SECONDS) {
          total += WORKING_DAY_SECONDS - workingSeconds;
        }
      } else {
        total += WORKING_DAY_SECONDS;
      }
    } else {
      total += WORKING_DAY_SECONDS;
    }
  });
  if (total > WORKING_DAY_SECONDS) {
    return Math.floor(total / WORKING_DAY_SECONDS).toString();
  } else {
    return '0';
  }
}

export function getTableHeaderOption(label, property, align) {
  return {
    label: label,
    property: property,
    align: align,
    headerAlign: align,
    valign: 'center',
  };
}

export function getTableNameHeaderOption(align) {
  return {
    label: '',
    align: align,
    headerAlign: align,
    valign: 'center',
  };
}

export function getTableIndividualHeaderOption(label, property, align) {
  return {
    label: label,
    property: property,
    align: align,
    headerAlign: align,
    valign: 'center',
    headerColor: '#FFFFFF',
  };
}

export function getColumnWidth(width: number, percent: number) {
  return (width / 100) * percent;
}

export function getDates(start_at, period, minusday = false) {
  if (minusday) {
    const momentDate = moment(start_at).add(-1, 'days');
    return Array.from({ length: period }).map(() => momentDate.add(1, 'days').clone());
  } else {
    const momentDate = moment(start_at);
    return Array.from({ length: period }).map(() => momentDate.add(1, 'days').clone());
  }
}

export function generateOTP(length: number): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function getDateList(startDate: Date, endDate: Date) {
  const dateArray = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export function zeroPad(value: number) {
  const S = String(value);
  if (S.length < 2) {
    return '0' + S;
  }
  return S;
}
