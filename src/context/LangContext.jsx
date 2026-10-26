// ── Language Context ──────────────────────────────────────────────────────────
import { createContext, useContext, useState } from 'react';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // 'en' | 'bn'
  const toggle = () => setLang((l) => (l === 'en' ? 'bn' : 'en'));
  return (
    <LangContext.Provider value={{ lang, toggle, isBn: lang === 'bn' }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
