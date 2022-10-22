export default class BaseResponse<R = any, E = any> {
  constructor(
    public success: boolean,
    public message: string,
    private result: R,
    private error: E,
    public meta: any,
  ) {}

  public getResult() {
    return this.result;
  }

  public getError() {
    return this.error;
  }
}
