export interface ReleaseRequest {
  id: number;
  releaseId: number;
  name: string;
  sequenceNumber: number;
  description: string;
  status: string;
}

export class ReleaseRequestInstance implements ReleaseRequest {
  static statusNew: string = 'Nový';
  static statusApproved: string = 'Schválený';
  static statusExported: string = 'Exportovaný';
  static statuses: string[] = [
    ReleaseRequestInstance.statusNew,
    ReleaseRequestInstance.statusApproved,
    ReleaseRequestInstance.statusExported,
  ];
  id: number;
  releaseId: number;
  name: string;
  sequenceNumber: number;
  description: string;
  status: string;
}
