export default class AppError extends Error {
  statusCode: number;
  errors: string[];
  name: string;

  constructor({ message, statusCode, errors }: IAppError) {
    super(message);

    this.statusCode = statusCode || 400;
    this.name = 'AppError';
    this.errors = errors || [];
  }
}

interface IAppError {
  statusCode?: number;
  message: string;
  errors?: string[];
}
