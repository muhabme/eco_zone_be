import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hashPassword = async (password: string, salt: string) => {
  return (await scrypt(password, salt, 32)) as Buffer;
};
