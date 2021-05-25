export interface LockState {
  isLocked: boolean;
  forUserId: string;
  forUserName: string;
  created: Date;
  forReleaseId: number;
}
