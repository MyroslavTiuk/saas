export function isSignIn() {
  const accessToken = window.localStorage.getItem("access_token");
  return accessToken != null;
}

export function setAccessToken(data) {
  window.localStorage.setItem("access_token", data["access_token"]);
  window.localStorage.setItem("refresh_token", data["refresh_token"]);
  window.localStorage.setItem("expire_in", data["expire_in"]);
  window.localStorage.setItem("token_type", data["token_type"]);
}

export function getAccessToken() {
  const type = window.localStorage.getItem("token_type");
  const access_token = window.localStorage.getItem("access_token");
  return type + " " + access_token;
}

export function clearAll() {
  window.localStorage.clear();
}

export function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}