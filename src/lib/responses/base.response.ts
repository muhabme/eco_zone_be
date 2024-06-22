import { Mixin } from 'ts-mixer';
import { Encodable } from '../concerns/encodable';

export abstract class BaseResponse extends Mixin(Encodable) {}
