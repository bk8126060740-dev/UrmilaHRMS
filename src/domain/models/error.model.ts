
export class ErrorModel {
  title: string = "";
  status: number = 0;
  detail: string = "";
  errors: Errors = new Errors();
}

export class Errors {
  Document: string[] = [];

}

