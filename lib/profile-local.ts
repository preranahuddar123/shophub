export const PROFILE_STORAGE_KEY = 'shophub_profile';

export type ProfileLocal = {
  avatarUrl: string;
  coverUrl: string;
  displayName: string;
  title: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
};

export const EMPTY_PROFILE: ProfileLocal = {
  avatarUrl: '',
  coverUrl: '',
  displayName: '',
  title: '',
  phone: '',
  location: '',
  website: '',
  bio: '',
};

export function readLocalProfile(): ProfileLocal {
  if (typeof window === 'undefined') return EMPTY_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function writeLocalProfile(profile: ProfileLocal) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  queueMicrotask(() => window.dispatchEvent(new Event('shophub-profile-updated')));
}
