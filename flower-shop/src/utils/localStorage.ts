export const saveToLocalStorage = (
  name: string,
  data: unknown,
  expirationTime: number = Date.now() + 1000 * 60 * 10 // 10 min
): void => {
  const cachedData = {
    data,
    expiration: expirationTime,
  };

  localStorage.setItem(name, JSON.stringify(cachedData));
};

export const getFromLocalStorage = (name: string) => {
  const raw = localStorage.getItem(name);
  if (!raw) return null;

  try {
    const cached = JSON.parse(raw);
    const currentTime = Date.now();

    if (cached.expiration && currentTime > cached.expiration) {
      localStorage.removeItem(name);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error("Failed to parse localStorage item:", name);
    return null;
  }
};

export const removeFromLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};
