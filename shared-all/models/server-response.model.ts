export interface ServerResponse {
  isSuccess: boolean;
  data?: any;
  error?: {
    code?: string | number;
    message: string;
  };
}
