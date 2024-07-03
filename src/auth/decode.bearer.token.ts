export const getToken = (auth: string) => {
  if (auth.startsWith('Bearer')) {
    return auth.substring(7, auth.length);
  }
  return null;
};
