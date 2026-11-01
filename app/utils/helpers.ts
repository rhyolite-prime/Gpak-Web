

export const filterQueryParams = (query: any) => {
  const obj = {} as any;
  for (const param in query) {
    if (!isUndefined(query[param])) {
      obj[param] = query[param];
    }
  }
  return obj;
};

export const isUndefined = (val: any) => {
  return (
    val === undefined ||
    typeof val === "undefined" ||
    (typeof val === "string" && !val?.length)
  );
};