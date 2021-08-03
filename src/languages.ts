import data from "./data";

interface Languages {
  [key: string]: { name: string; native_name: string; emoji: string };
}

const languages: Languages = data.languages;

export const languageIsAvailable = (languageCode: string) => {
  return languageCode in languages;
};

export const getLangauges = () => {
  const toReturn = [];

  for (let language in languages)
    toReturn.push(
      `${languages[language].emoji} ${language} - ${languages[language].native_name}`
    );

  return toReturn.join("\n");
};
