export const $api = async (url, options = {}) => {
  const { method = "GET", body } = options;

  let urlRes = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${url}`;
  const optionsForFetch = {
    method: method,
  };
  if (body) {
    if (method === "GET") {
      Object.keys(body).forEach((key, index) => {
        urlRes += index === 0 ? "?" : "&";
        urlRes += `${key}=${body[key].toString()}`;
      });
    } else {
      optionsForFetch["body"] = JSON.stringify(body);
    }
  }

  const response = await fetch(urlRes, {
    headers: {
      "content-type": "application/json",
    },
    ...optionsForFetch,
  });

  return await response.json();
};
