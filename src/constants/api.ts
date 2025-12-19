export enum ApiCode {
  Success = 0,
  Fail = 1,
  LoginFailed = 1001,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export default ApiCode;
