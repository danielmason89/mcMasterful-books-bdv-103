import { Get, Route, Path } from 'tsoa';

@Route('hello')
export class HelloRoute {
  @Get('{name}')
  public async greet(@Path() name: string): Promise<string> {
    return `Hello ${name}`;
  }
}
