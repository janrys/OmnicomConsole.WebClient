export interface Release {
  id: number;
  name: string;
  date: Date;
  version: string;
  status: string;
}

export class ReleaseInstance implements Release {
  static statusNew: string = 'Nový';
  static statusFinished: string = 'Ukončený';
  static statuses: string[] = [ReleaseInstance.statusNew, ReleaseInstance.statusFinished];
  id: number;
  name: string;
  date: Date;
  version: string;
  status: string;
}
