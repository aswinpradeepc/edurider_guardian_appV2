export interface UserProfile {
    user_type: 'admin' | 'driver' | 'guardian';
    email: string;
    first_name: string;
    last_name: string;
  }
  
  export interface AuthTokens {
    access: string;
    refresh: string;
  }
  
  export interface AuthState {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
    user: UserProfile | null;
  }