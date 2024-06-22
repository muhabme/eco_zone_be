import { classToPlain, plainToClass } from 'class-transformer';

export abstract class ToObject {
  toObject() {
    return classToPlain(this);
  }

  static fromObject<T, V>(this: ClassConstructor<T>, plain: V): T {
    return plainToClass(this, plain);
  }
}
