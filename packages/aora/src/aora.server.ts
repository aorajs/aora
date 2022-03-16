import { render } from './render';

export class AoraServer {
  protected options: any;

  constructor(options: any) {
    this.options = options;
  }

  public async prepare() {
    console.log(11);
  }

  public render(data: unknown, ctx: any, options?: any): Promise<string>;
  public render<T>(data: unknown, ctx: any, options?: any): Promise<T>;
  public async render(data: unknown, ctx: any, options?: any) {
    return await render(data, ctx, options);
  }
}
