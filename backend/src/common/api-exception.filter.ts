import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

interface HttpResponse {
  status(code: number): this;
  json(body: ApiErrorBody): void;
}

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  fieldErrors?: Array<{ field: string; code: string }>;
}

function safeField(field: string): string {
  return /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(field) ? field : 'request';
}

export function normalizeApiException(exception: unknown): ApiErrorBody {
  if (!(exception instanceof HttpException)) {
    return {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    };
  }

  const statusCode = exception.getStatus();
  const exceptionBody = exception.getResponse();
  const details = typeof exceptionBody === 'object' && exceptionBody !== null
    ? exceptionBody as Record<string, unknown>
    : {};

  if (statusCode === 400) {
    const fieldErrors = Array.isArray(details.fieldErrors)
      ? details.fieldErrors
          .filter((item): item is { field: string; code: string } =>
            typeof item === 'object' && item !== null &&
            typeof (item as { field?: unknown }).field === 'string' &&
            typeof (item as { code?: unknown }).code === 'string',
          )
          .map(({ field, code }) => ({ field: safeField(field), code }))
      : [];
    return {
      statusCode,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      ...(fieldErrors.length > 0 ? { fieldErrors } : {}),
    };
  }

  if (statusCode === 429) {
    return { statusCode, code: 'RATE_LIMITED', message: 'Too many requests' };
  }

  return {
    statusCode,
    code: 'REQUEST_ERROR',
    message: 'The request could not be completed',
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    const body = normalizeApiException(exception);
    response.status(body.statusCode).json(body);
  }
}
