export const ApiCode = {
  Success: 1001,
  Fail: 1002,
  LoginFailed: 1003,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  ServerError: 500,
} as const;

export type ApiCode = (typeof ApiCode)[keyof typeof ApiCode];
export default ApiCode;
