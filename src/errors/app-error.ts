export class AppError extends Error {
  public readonly statusCode: number;
  public readonly detalhes?: string[];

  constructor(statusCode: number, message: string, detalhes?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}
