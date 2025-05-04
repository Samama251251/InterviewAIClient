export interface EditUserData {
  name: string;
}

export interface EditUserResponse {
  status: string;
  data: User;
  message: string;
}


export interface User {
  _id: string;
  name: string;
  email: string;
} 