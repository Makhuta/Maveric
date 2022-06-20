function MilisecondsToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ("00" + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  let text;
  let hours = pad(hrs);
  let minutes = pad(mins);
  let seconds = pad(secs);

  if (hours < 1) {
    if (minutes < 1) {
      if (seconds < 1) {
        text = ">1 second";
      } else {
        text = `${seconds} seconds`;
      }
    } else {
      text = `${minutes}:${seconds}`;
    }
  } else {
    text = `${hours}:${minutes}:${seconds}`;
  }

  return text;
}

module.exports = MilisecondsToTime;
