
export type Priority = 'high' | 'medium' | 'low';

  
export interface IUser {
  _id: string
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  salt: string;
  avatar?: any;
  };
