export const getAnimeAvatar = (user) => {
  const isFemale = user?.gender === 'female' || (!user?.gender && String(user?.profilePic || '').includes('/girl'));
  const gender = isFemale ? 'female' : 'male';
  const seed = String(user?._id || user?.username || user?.fullName || 'chat')
    .split('')
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return `/avatars/anime-${gender}-${(seed % 2) + 1}.svg`;
};
