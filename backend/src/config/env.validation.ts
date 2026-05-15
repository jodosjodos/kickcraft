import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync, Min } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1)
  PORT: number = 3001;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsNumber()
  @Min(1)
  JWT_EXPIRES_IN: number = 86400;

  @IsString()
  SMTP_HOST!: string;

  @IsNumber()
  @Min(1)
  SMTP_PORT: number = 587;

  @IsString()
  SMTP_USER!: string;

  @IsString()
  SMTP_PASS!: string;

  @IsString()
  SMTP_FROM!: string;

  @IsString()
  FRONTEND_URL!: string;

  @IsString()
  MINIO_ENDPOINT!: string;

  @IsNumber()
  @Min(1)
  MINIO_PORT: number;

  @IsString()
  MINIO_USE_SSL: string = 'false';

  @IsString()
  MINIO_ACCESS_KEY!: string;

  @IsString()
  MINIO_SECRET_KEY!: string;

  @IsString()
  MINIO_BUCKET!: string;

  @IsString()
  MINIO_PUBLIC_URL!: string;

  @IsString()
  ADMIN_EMAIL!: string;

  @IsString()
  ADMIN_PASSWORD!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validated;
}
