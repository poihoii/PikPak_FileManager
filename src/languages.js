import { gmGet } from './utils';
import ko from './locales/ko';
import en from './locales/en';
import ja from './locales/ja';
import zh from './locales/zh';

const T = { ko, en, ja, zh };

export function getLang() {
    const userLang = gmGet('pk_lang', '');
    if (userLang) return userLang;
    const navLang = navigator.language.slice(0, 2);
    return T[navLang] ? navLang : 'en';
}

export function getStrings() {
    return T[getLang()] || T.en;
}