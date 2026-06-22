const defaultPreferences = [
  {
    key: "colorScheme",
    value: "system",
  },
  {
    key: "locale",
    value: "system",
  },
];

const getDefaultPreference = (key: string) =>
  defaultPreferences.find((preference) => preference.key === key)?.value ?? null;

const readPreferences = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawPreferences = localStorage.getItem("preferences");
  if (!rawPreferences) {
    return {};
  }

  try {
    const parsedPreferences = JSON.parse(rawPreferences);
    if (parsedPreferences && typeof parsedPreferences === "object") {
      return parsedPreferences as Record<string, string>;
    }
  } catch {
    localStorage.removeItem("preferences");
  }

  return {};
};

const get = (key: string) => {
  const preferences = readPreferences();
  return preferences[key] ?? getDefaultPreference(key);
};

const set = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    const preferences = readPreferences();
    preferences[key] = value;
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }
};
const userPreferences = {
  get,
  set,
};

export default userPreferences;
