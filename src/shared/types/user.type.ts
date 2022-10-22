export type TUser = {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string | null;
  description: string | null;
  username: string;
  password: string;
  siteId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TUserCustomInformation = Partial<TUser> & {
  siteCode: string;
  roles: string[];
  permissions: string[];
};
