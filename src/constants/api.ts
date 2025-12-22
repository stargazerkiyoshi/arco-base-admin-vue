export const ApiCode = {
  Success: 0,
  Fail: 1,
  LoginFailed: 1001,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  ServerError: 500,
} as const;

export type ApiCode = (typeof ApiCode)[keyof typeof ApiCode];
export default ApiCode;
