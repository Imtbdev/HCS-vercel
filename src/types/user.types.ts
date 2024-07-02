export interface IUserInfo {
  image: any;
  token: string;
  id: string;
  username: string;
  email: string;
  fullname: string;
  phone: number;
  houses: any[];
  isAdmin: boolean;
  active: boolean;
  confirmed: boolean;
  blocked: boolean;
}

export interface IHouseInfo {
  id: number;
  title: string;
  codeFIAS: string;
  details: {
    age: number;
    name: string;
    about: string;
  }[];
  address: string;
}

export interface IInvoiceInfo {
  id: number;
}
