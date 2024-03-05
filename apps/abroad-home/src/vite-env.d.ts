/// <reference types="vite/client" />
type JSONValue =
  | string
  | number
  | null
  | boolean
  | JSONValue[]
  | { [key: string]: JSONValue };
console.log(data, obj);

interface ResType {
  code: number;
  data?: any;
  message: string;
}
