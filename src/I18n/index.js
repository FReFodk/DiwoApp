import i18n from 'i18next';
import {reactI18nextModule} from 'react-i18next';
import locale from 'react-native-locale-detector';
import {AsyncStorage} from 'react-native';

import da from './da.json';
import en from './en.json';

const STORAGE_KEY = '@APP:languageCode';

// creating a language detection plugin using expo
// http://i18n.com/docs/ownplugin/#languagedetector
const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async callback => {
    const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
    const lng = savedDataJSON ? savedDataJSON : null;
    const selectLanguage = lng || locale;
    console.log('detect - selectLanguage:', selectLanguage);
    callback(selectLanguage);
  },
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'da',
    resources: {en, da},

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',

    debug: true,

    //   cache: {
    //  enabled: true
    // },

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

export default i18n;
