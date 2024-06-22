import { configDotenv } from 'dotenv';
import { join } from 'path';

import { blank, toBoolean } from '../helpers/boolean';
import { toString } from '../helpers/string';

configDotenv();

interface AsNumberOptions {
  min?: number;
  max?: number;
}
export class Env {
  static envPaths(): string[] {
    const node = { env: Env.getOptional('NODE_ENV')?.asString() ?? '' };

    node.env = node.env === 'development' ? '' : node.env;

    const envFile = blank(node.env) ? '.env' : `.env.${node.env}`;

    return [envFile];
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

  static path(path: string): string {
    return process.env.NODE_ENV === 'production'
      ? join(process.cwd(), path.replace('src/', 'dist/').replace('.ts', '.js'))
      : join(process.cwd(), path);
  }

  static dir(path: string): string {
    return process.env.NODE_ENV === 'production'
      ? join(process.cwd(), path.replace('src/', 'dist/'))
      : join(process.cwd(), path);
  }

  static paths(paths: string[]): string[] {
    return paths.map((p) => Env.path(p));
  }

  static osPath(key: string): string {
    return Env.path(Env.get(key).asString());
  }

  static osPaths(key: string): string[] {
    return Env.paths(Env.getArray(key));
  }

  static getArray(key: string, delimiter = ','): string[] {
    const line: string | undefined = process.env[key];

    if (line === undefined) {
      return [];
    }

    return line.split(delimiter);
  }

  static nodeEnv() {
    return Env.getOptional('NODE_ENV')?.asString();
  }

  static isInTesting(): boolean {
    return Env.nodeEnv() === 'testing';
  }

  constructor(protected value: unknown) {}

  asPort({ defaultPort = 3000 }: { defaultPort?: number } = {}): number {
    const parsedPort = Number.parseInt(this.value as string, 10);

    if (parsedPort >= 0) {
      return parsedPort;
    }

    return defaultPort;
  }

  private asNumber(
    parsedNumber: number,
    options: AsNumberOptions = {},
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

  asInt(options: AsNumberOptions = {}): number {
    return this.asNumber(Number.parseInt(this.value as string, 10), options);
  }

  asFloat(options: AsNumberOptions = {}): number {
    return this.asNumber(Number.parseFloat(this.value as string), options);
  }

  asString(): string {
    return toString(this.value);
  }

  asBoolean(): boolean {
    return toBoolean(this.value);
  }
}
