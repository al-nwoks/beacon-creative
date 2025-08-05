declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Utility Types
export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
  status: number;
};

export type KeyValuePair = {
  [key: string]: string | number | boolean | null | undefined;
};

// Replace 'any' with this type for handling generic objects
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Function parameter types
export type ErrorCallback = (error: string) => void;
export type SuccessCallback = (data: JsonValue) => void;
