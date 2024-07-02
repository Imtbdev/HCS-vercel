export const saveErrorServer = (e: any) => {
  console.group("Server Error");
  console.warn(e);
  console.groupEnd();
};

export const showErrorFromLogin = (data: any) => {
  if (data && data.error) {
    console.warn(data);
  }
};
export const showErrorFromError = (error: unknown) => {
  if (error instanceof Error) {
    console.warn(error);
    alert(error.message);
  } else {
    const errorMessage = typeof error === "string" ? error : "Unknown error";
    console.warn(errorMessage);
    alert(errorMessage);
  }
};
