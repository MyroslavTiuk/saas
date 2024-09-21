import Config from "../config";

const API_URL = Config.api_url.replace(/\/$/g, "");

export function makeQueryString(...allParams) {
  const queryString = allParams
    .filter(Boolean)
    .map((params) =>
      Object.entries(params)
        .filter(([key, value]) => value !== "All")
        .map(([key, value]) => {
          let newValue = value;

          if (Array.isArray(value)) {
            newValue = value.join(",");
          }

          if (!newValue) {
            return undefined;
          }

          return `${encodeURIComponent(key)}=${encodeURIComponent(newValue)}`;
        })
    )
    .flat()
    .filter((v) => v !== undefined)
    .join("&");

  return "?" + queryString;
}

async function makeRequest(url, options) {
  const fetchUrl = url.startsWith("/") ? url : "/" + url;
  const response = await fetch(`${API_URL}${fetchUrl}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    // eslint-disable-next-line no-throw-literal
    throw {success: false, statusCode: response.status};
  }

  const body = await response.json();

  if (response.status !== 200) {
    // eslint-disable-next-line no-throw-literal
    throw {success: false, ...body, statusCode: response.status};
  }

  return body;
}

export function makeGetRequest(url) {
  return makeRequest(url, {method: "GET"});
}


export function makePutRequest(url, body) {
  return makeRequest(url, {
    method: "PUT",
    body: body && JSON.stringify(body),
  });
}
