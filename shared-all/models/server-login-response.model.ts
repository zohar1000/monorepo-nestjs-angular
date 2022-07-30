import { UserProfile } from '@shared-all/models/entities/user-profile.model';

export interface ServerLoginResponse {
  isSuccess: boolean;
  user?: UserProfile;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}
