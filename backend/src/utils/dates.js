import moment from "moment";

const WORKING_DAY_SECONDS = 7 * 3600 + 21 * 60;

export function toHoursAndMinutesAndSeconds(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

export function getAddDays(date, period) {
  switch (period) {
    case "weekly":
      return 7;
    case "fortnightly":
      return 14;
    case "monthly":
      return date.daysInMonth();
    default:
      return 1;
  }
}

export function getCurrentDate(period) {
  switch (period) {
    case "weekly":
      return moment().format("YYYY-[W]WW");
    case "fortnightly":
      return moment().add(-7, "days").format("YYYY-[W]WW");
    case "monthly":
      return moment().format("YYYY-MM");
    default:
      return moment().format("YYYY-MM-DD");
  }
}

export function getCurrentDateType(period) {
  switch (period) {
    case "weekly":
    case "fortnightly":
      return "week";
    case "monthly":
      return "month";
    default:
      return "date";
  }
}

export function getTotalHours(date, dateInfo, mode) {
  let total = 0;
  const isWeekend = date.day() % 6 === 0;
  const d = moment(dateInfo.worked_hours, "hh:mm:ss");
  const workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;

  if (mode === "base") {
    total += workingSeconds;
  }

  if (
    mode === "undertime" &&
    !isWeekend &&
    workingSeconds < WORKING_DAY_SECONDS
  ) {
    total += WORKING_DAY_SECONDS - workingSeconds;
  }

  if (mode === "overtime") {
    if (isWeekend) {
      total += workingSeconds;
    } else if (workingSeconds > WORKING_DAY_SECONDS) {
      total += workingSeconds - WORKING_DAY_SECONDS;
    }
  }

  return total;
}

export function calculateWorkedTimes(dates, rowDates, mode = "base") {
  let total = 0;

  dates.forEach((date) => {
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];

    if (!dateInfo) {
      return;
    }

    total += getTotalHours(date, dateInfo, mode);
  });

  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyHoursWorked(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date]
  if (dateInfo) {
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      total += workingSeconds;
    }
  }
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyActualHours(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date]
  if (dateInfo) {
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, "HH").hours();
      const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
  const dateInfo = rowDates[date];
  const isWeekend = moment(date).day() % 6 === 0;
  if (dateInfo && !isWeekend) {
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, "HH").hours();
      const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
  return toHoursAndMinutesAndSeconds(total);
}

export function calculateDailyOverTime(date, rowDates) {
  let total = 0;
  const dateInfo = rowDates[date];
  const isWeekend = moment(date).day() % 6 === 0;
  if (dateInfo && !isWeekend) {
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds > 0) {
      // check launch time
      const clock_in = moment(dateInfo.clocked_in, "HH").hours();
      const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (!dateInfo) {
      return;
    }
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
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
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (!dateInfo) {
      return;
    }
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds === 0) return; // Ignore clock out not available
    const clock_in = moment(dateInfo.clocked_in, "HH").hours();
    const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (dateInfo) {
      const d = moment(dateInfo.worked_hours, "hh:mm:ss");
      let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
      if (workingSeconds > 0) {
        // check launch time
        const clock_in = moment(dateInfo.clocked_in, "HH").hours();
        const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    if (workingSeconds === 0) return;
    // check launch time
    const clock_in = moment(dateInfo.clocked_in, "HH").hours();
    const clock_out = moment(dateInfo.clocked_out, "HH").hours();
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
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function calculatePeriodSundayHours(dates, rowDates) {
  let total = 0;
  dates.forEach((date) => {
    const isSunday = date.day() === 0; // Sunday
    if (!isSunday) return;
    const dateInfo = rowDates[date.format("YYYY-MM-DD")];
    if (!dateInfo) return;
    const d = moment(dateInfo.worked_hours, "hh:mm:ss");
    let workingSeconds = d.seconds() + d.minutes() * 60 + d.hours() * 3600;
    total += workingSeconds;
  });
  return toHoursAndMinutesAndSeconds(total);
}

export function isSaturday(date) {
  if (typeof date == "string") {
    return moment(date).day() === 6; // Sunday
  }
  return date.day() === 6; // Saturday
}

export function isSunday(date) {
  if (typeof date == "string") {
    return moment(date).day() === 0; // Sunday
  }
  return date.day() === 0; // Sunday
}

export function isWeekEnd(date) {
  if (typeof date == "string") {
    return moment(date).day() % 6 === 0;
  }
  return date.day() % 6 === 0;
}

export function getWeekDay(date) {
  return moment(date).format("YYYY-MM-DD");
}

export function getMonthlyDay(date) {
  return moment(date).format("YYYY-MM-DD");
}

