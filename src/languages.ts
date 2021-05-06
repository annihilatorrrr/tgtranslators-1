import { data } from "./constants";

interface Languages {
  [key: string]: { name: string; native_name: string; emoji: string };
}

const languages: Languages = data.languages;

export const languageAvailable = (languageCode: string): boolean => {
  return languageCode in languages;
};

export const getLangauges = (): string => {
  const toReturn = [];

  for (let language in languages)
    toReturn.push(
      `${languages[language].emoji} ${language} - ${languages[language].native_name}`
    );

  return toReturn.join("\n");
};
