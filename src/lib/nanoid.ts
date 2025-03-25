import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const myNanoid = customAlphabet(alphabet);

export function nanoid(size: number = 6) {
  return myNanoid(size);
}
