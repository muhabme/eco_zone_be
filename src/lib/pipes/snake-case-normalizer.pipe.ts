import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { snakeCase } from 'lodash';

@Injectable()
export class SnakeCaseNormalizerPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      value = this.convertToSnakeCase(value);
    }
    return value;
  }

  private convertToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertToSnakeCase(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((result, key) => {
        const snakeCaseKey = snakeCase(key);
        result[snakeCaseKey] = this.convertToSnakeCase(obj[key]);
        return result;
      }, {} as any);
    }
    return obj;
  }
}
