export interface LockState {
  isLocked: boolean;
  forUserId: string;
  forUserName: string;
  created: Date;
  forRequestId: number;
}
