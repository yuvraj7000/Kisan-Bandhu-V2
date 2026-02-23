import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';
import bn from './bn.json';
import ta from './ta.json';
import gu from './gu.json';
import kn from './kn.json';
import ml from './ml.json';
import or from './or.json';
import pa from './pa.json';
import te from './te.json';



i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: en,
    hi: hi,
    mr: mr,
    bn: bn,
    ta: ta,
    gu: gu,
    kn: kn,
    ml: ml,
    or: or,
    pa: pa,
    te: te,
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});
const word = i18next.t('hello')



export default i18next;