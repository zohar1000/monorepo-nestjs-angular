import { User } from '@shared-all/models/entities/user.entity';
import { UserProfile } from '@shared-all/models/entities/user-profile.model';

export interface LocalStrategyResponse {
  isLoginSuccess: boolean;
  message?: string;
  user?: User;
  userProfile?: UserProfile;
}
