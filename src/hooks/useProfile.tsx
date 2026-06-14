import { logWarn } from '@/utils/logger';

export const useProfile = () => {
  logWarn('useProfile hook is deprecated. Use useSupabaseProfile instead.');
  
  return {
    profile: null,
    loading: false,
    error: null,
    updateProfile: () => Promise.resolve(),
    updatePassword: () => Promise.resolve(),
  };
};