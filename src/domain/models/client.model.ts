export interface IClient {
  success: boolean;
  message: string;
  data: ClientDaum[];
}

export class ClientDaum {
  id: number = 0;
  userId: number = 0;
  name: string = '';
  description: string = '';
  address: string = '';
  gstinOrUIN: string = '';
  panOrIT: string = '';
  stateId: string = '';
  email: string = '';
  contactNumber: string = '';
  document?: File | null = null;
  documentPath: string = '';
  tanNumber: string = '';
  clientLeaders: LeaderModel[] = [];
}

export class ClientModel {
  totalCount: number = 0;
  data: ClientDaum[] = [];
  success: boolean = false;
  message: string = '';
}

export class LeaderModel {
  id: number = 0;
  clientId: number = 0;
  leaderLevel: number = 0;
  leaderLevelName: string = '';
  name: string = '';
  designation: string = '';
  email: string = '';
  contactNumber: string = '';
}
// testing

export class ClientListModel {
  value: number = 0;
  text: string = '';
}
