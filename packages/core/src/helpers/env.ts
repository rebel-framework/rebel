export const env = <T>(key: string, defaultValue?: T): T => {
  const value = process.env[key];

  if (value === undefined) {
    return defaultValue as T;
  }

  switch (typeof defaultValue) {
    case 'boolean':
      return value === 'true' || value === '1' ? (true as T) : (false as T);
    case 'number':
      return parseFloat(value) as T;
    default:
      return value as T;
  }
};
