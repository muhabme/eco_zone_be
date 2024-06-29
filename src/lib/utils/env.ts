import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { toBoolean } from '../helpers/boolean';
import { toString } from '../helpers/string';

export class Env {
  constructor(protected value: unknown) {}

  static envFilePath() {
    const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

    if (fs.existsSync(envFilePath)) {
      dotenv.config({ path: envFilePath });
    } else {
      throw new Error(`Environment file ${envFilePath} does not exist`);
    }

    return envFilePath;
  }

  static get(key: string): Env {
    if (process.env[key] === undefined) {
      throw new TypeError(`Environment variable ${key} is not set.`);
    }

    return new Env(process.env[key] as string);
  }

  static getOptional(key: string): Env | undefined {
    return new Env(process.env[key] as string);
  }

  private asNumber(
    parsedNumber: number,
    options: {
      min?: number;
      max?: number;
    } = {},
  ): number {
    if (Number.isNaN(parsedNumber)) {
      throw new TypeError(
        `Environment variable ${this.value} is not a number.`,
      );
    }

    if (options.min !== undefined && parsedNumber < options.min) {
      throw new TypeError(
        `Environment variable ${this.value} is less than the minimum value of ${options.min}.`,
      );
    }

    if (options.max !== undefined && parsedNumber > options.max) {
      throw new TypeError(
        `Environment variable ${this.value} is greater than the maximum value of ${options.max}.`,
      );
    }

    return parsedNumber;
  }

  asInt(
    options: {
      min?: number;
      max?: number;
    } = {},
  ): number {
    return this.asNumber(Number.parseInt(this.value as string, 10), options);
  }

  asPort({ defaultPort = 3000 }: { defaultPort?: number } = {}): number {
    const parsedPort = Number.parseInt(this.value as string, 10);

    if (parsedPort >= 0) {
      return parsedPort;
    }

    return defaultPort;
  }

  asString(): string {
    return toString(this.value);
  }

  asBoolean(): boolean {
    return toBoolean(this.value);
  }
}
