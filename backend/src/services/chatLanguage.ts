// Language detection service for BantAI
export type Language = 'ENGLISH' | 'TAGALOG' | 'BISAYA' | 'TAGLISH';

interface LanguageResult {
  language: Language;
  confidence: number;
}

const patterns: Record<Language, string[]> = {
  BISAYA: ['kumusta','salamat','daghang','gihapon','karon','adto','diri','unsay','kinsay','bitaw','lagi','sus','ambot','gusto','ganahan','palihug','salig','bayad','tubag','pangutana','pila','asa','unsaon','akoang','imoang','atong','inyong','ako','ikaw','siya','kita','kamo','sila','niini','niana','niadto','diha','naghimo','nagtrabaho','nagtuon','nagkaon','nag-inom','naglakaw','nagdagan','barangay hall','clearance','permi',' residence','purok','kapitan','kagawad','maayong','buntag','hapon','gabii','adlaw','gab-i','kaadlawan','higala','amigo','amiga','igsoon','manghod','tiyay','totoy','o','dili','oo','wala','ara','wala pa','nahuman','wa pa','taga-a','taga-as','taga-asa','asa man','unsa ni','kinsa ni'],
  TAGALOG: ['kamusta','salamat','maraming','po','opo','hindi','wala','meron','ito','iyan','siya','ako','ikaw','tayo','kayo','sila','nandito','niyan','niyon','doon','paano','bakit','saan','kailan','sino','ano','alin','gaano','ilan','gusto','ayaw','kailangan','pwede','pwedeng','bawal','pwede ba','puwede','tulong','saklolo','tawag','tumawag','magtawag','tumulong','magbigay','barangay','punong','kapitan','kagawad','tanod','sekretarya','klerek','umaga','hapon','gabi','araw','gabing','tanghali','madaling','magandang','maganda','pangit','mabait','masama','masaya','malungkot','oo','hindi','siguro','baka','yata','daw','raw','naman','nga','lang','ginagawa','nagtatrabaho','nag-aaral','kumakain','umiinom','lumalakad','paano mag','paano kumuha','paano magbayad','saan ang','kailan ang'],
  TAGLISH: ['kamusta na','ok lang','sige na','bahala na','bahala ka','gawa na','nagpunta','nag-asikaso','nagprocess','nagfile','nagapply','nagrequest','nagbayad na','nagwork','nagstudy','nagcheck','nagverify','barangay id','barangay clearance','residency certificate','blotter report','purok leader','barangay captain','office hours','contact number','saan yung','asan ang','san ba','saan ba','pano mag','pano kumuha','ok na','pwede na','bawal ba','pwede ba','meron ba','wala ba','thank you po','thanks po','salamat po','ty po','salamat ha','hello po','hi po','excuse me po','pasensya na po','pasensya na'],
  ENGLISH: ['hello','hi','hey','good morning','good afternoon','good evening','thank you','thanks','please','help','what','where','when','who','why','how','is','are','was','were','will','would','can','could','should','may','might','need','want','like','love','hate','know','think','believe','understand','barangay','clearance','certificate','residency','id card','announcement','emergency','contact','number','office','hours','location','address','apply','application','process','requirement','document','fee','payment','latest','recent','new','update','information','news','schedule','appointment']
};

export function detectLanguage(message: string): LanguageResult {
  const lower = message.toLowerCase();
  const scores: Record<Language, number> = { ENGLISH: 0, TAGALOG: 0, BISAYA: 0, TAGLISH: 0 };
  
  for (const [lang, words] of Object.entries(patterns)) {
    for (const word of words) {
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) scores[lang as Language] += matches.length;
      else if (lower.includes(word.toLowerCase())) scores[lang as Language] += 0.5;
    }
  }
  
  ['gihapon','karon','adto','diri','unsay','kinsay','bitaw','lagi'].forEach(w => { if (lower.includes(w)) scores.BISAYA += 2; });
  ['po','opo','ho','oh','naman','nga','lang','daw','raw','yata'].forEach(w => { if (lower.includes(w)) scores.TAGALOG += 2; });
  
  let lang: Language = 'ENGLISH';
  let max = scores.ENGLISH;
  for (const [l, s] of Object.entries(scores)) { if (s > max) { max = s; lang = l as Language; } }
  if (max < 0.5) lang = 'ENGLISH';
  if (scores.TAGLISH > 1 && scores.TAGLISH >= scores.TAGALOG * 0.8) lang = 'TAGLISH';
  
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return { language: lang, confidence: total > 0 ? max / total : 0 };
}

export function getLanguageInstruction(lang: Language): string {
  return {
    ENGLISH: 'Respond in English only.',
    TAGALOG: 'Respond in Tagalog/Filipino only. Use natural Filipino expressions. Mix English only when necessary for technical terms.',
    BISAYA: 'Respond in Bisaya/Cebuano only. Use natural Cebuano expressions and vocabulary. Mix English or Tagalog only when necessary for technical terms that have no Bisaya equivalent.',
    TAGLISH: 'Respond in Taglish (mix of Tagalog and English) naturally. This is how Filipinos commonly communicate - mix Tagalog/Filipino with English words and phrases as appropriate.'
  }[lang];
}

export function getWelcomeMessage(lang: Language): string {
  return {
    ENGLISH: "Mabuhay! I'm bAI, your Barangay Purisima virtual assistant. Ask me anything about barangay services, announcements, or emergencies!",
    TAGALOG: "Mabuhay! Ako si bAI, ang iyong Barangay Purisima virtual assistant. Magtanong po kayo tungkol sa mga serbisyo ng barangay, announcement, o emergency!",
    BISAYA: "Mabuhay! Ako si bAI, ang imong Barangay Purisima virtual assistant. Pangutana ko bahin sa mga serbisyo sa barangay, announcement, o emergency!",
    TAGLISH: "Mabuhay! Ako si bAI, your Barangay Purisima virtual assistant. Ask me anything about barangay services, announcements, or emergencies!"
  }[lang];
}

export function getQuickReplies(lang: Language): string[] {
  return {
    ENGLISH: ['What are the latest announcements?','Any emergencies in my area?','How do I get barangay clearance?','What are the office hours?','How to contact the barangay?'],
    TAGALOG: ['Ano ang mga latest na announcement?','May emergency ba sa aming lugar?','Paano kumuha ng barangay clearance?','Ano ang office hours?','Paano makontak ang barangay?'],
    BISAYA: ['Unsa ang bag-ong announcement?','Naay emergency sa among lugar?','Unsaon pagkuha og barangay clearance?','Unsa ang office hours?','Unsaon pagkontak sa barangay?'],
    TAGLISH: ['Ano ang latest announcements?','May emergency ba sa area namin?','Paano kumuha ng barangay clearance?','Ano ang office hours?','Paano contact ang barangay?']
  }[lang];
}

export function getFallbackResponse(lang: Language): string {
  return {
    ENGLISH: "I'm having trouble connecting right now. Please try again in a moment, or contact the Barangay Hall directly at (032) 123-4567.",
    TAGALOG: "May problema po sa koneksyon ngayon. Pakiulit po mamaya, o tumawag diretso sa Barangay Hall sa (032) 123-4567.",
    BISAYA: "Naa'y problema sa koneksyon karon. Palihug usba unya, o tawag diretso sa Barangay Hall sa (032) 123-4567.",
    TAGLISH: "May problema sa connection ngayon. Please try again later, o tawag ka na lang sa Barangay Hall sa (032) 123-4567."
  }[lang];
}

export function getContactResponse(lang: Language): string {
  return {
    ENGLISH: `You can reach Barangay Purisima through:\nHotline: (032) 123-4567\nMobile: 0917-123-4567\nEmail: barangay.purisima@gmail.com`,
    TAGALOG: `Makontak ninyo ang Barangay Purisima sa:\nHotline: (032) 123-4567\nMobile: 0917-123-4567\nEmail: barangay.purisima@gmail.com`,
    BISAYA: `Makontak ninyo ang Barangay Purisima sa:\nHotline: (032) 123-4567\nMobile: 0917-123-4567\nEmail: barangay.purisima@gmail.com`,
    TAGLISH: `You can contact Barangay Purisima at:\nHotline: (032) 123-4567\nMobile: 0917-123-4567\nEmail: barangay.purisima@gmail.com`
  }[lang];
}

export function getOfficeHoursResponse(lang: Language): string {
  return {
    ENGLISH: `Barangay Purisima Office Hours:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday & Holidays: Closed`,
    TAGALOG: `Oras ng Opisina ng Barangay Purisima:\nLunes - Biyernes: 8:00 AM - 5:00 PM\nSabado: 8:00 AM - 12:00 PM\nLinggo at Pista Opisyal: Sarado`,
    BISAYA: `Oras sa Opisina sa Barangay Purisima:\nLunes - Biyernes: 8:00 AM - 5:00 PM\nSabado: 8:00 AM - 12:00 PM\nDomingo ug Holiday: Sarado`,
    TAGLISH: `Office Hours ng Barangay Purisima:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday & Holidays: Closed`
  }[lang];
}

export function getEmergencyResponse(lang: Language): string {
  return {
    ENGLISH: `For emergencies:\nCall 911 (National Emergency Hotline)\nBarangay Emergency: 0917-123-4567\n\nFor medical emergencies, go to the nearest hospital or health center.`,
    TAGALOG: `Para sa mga emergency:\nTumawag sa 911 (National Emergency Hotline)\nBarangay Emergency: 0917-123-4567\n\nPara sa medical emergency, pumunta sa pinakamalapit na ospital o health center.`,
    BISAYA: `Para sa mga emergency:\nTawag sa 911 (National Emergency Hotline)\nBarangay Emergency: 0917-123-4567\n\nPara sa medical emergency, adto sa pinakaduol nga ospital o health center.`,
    TAGLISH: `For emergencies:\nCall 911 (National Emergency Hotline)\nBarangay Emergency: 0917-123-4567\n\nFor medical emergencies, go to the nearest hospital or health center.`
  }[lang];
}

export function getThanksResponse(lang: Language): string {
  return {
    ENGLISH: "You're welcome! If you need anything else, just let me know. I'm here to help!",
    TAGALOG: "Walang anuman po! Kung may iba pa po kayong kailangan, sabihin lang po. Nandito po ako para tumulong!",
    BISAYA: "Walay sapayan! Kung naay lain pang gusto nimong pangutan-on, sulti lang. Ania ko aron motabang!",
    TAGLISH: "You're welcome! Kung may kailangan ka pa, just let me know. I'm here to help!"
  }[lang];
}

export function getFarewellResponse(lang: Language, name?: string): string {
  const n = name ? ` ${name}` : '';
  return {
    ENGLISH: `Goodbye${n}! Take care and stay safe. Feel free to chat with me anytime!`,
    TAGALOG: `Paalam${n}! Ingat po kayo palagi. Maari po kayong magchat sa akin anytime!`,
    BISAYA: `Paalam${n}! Pag-amping kanunay. Pwede ka magchat nako anytime!`,
    TAGLISH: `Bye${n}! Take care and stay safe. Chat with me anytime!`
  }[lang];
}

export function getHelpMessage(lang: Language): string {
  return {
    ENGLISH: `I can help you with:\nLatest announcements from the barangay\nEmergency alerts and information\nBarangay services (clearance, ID, certificates)\nContact information and office hours\nLocation and directions\n\nWhat would you like to know?`,
    TAGALOG: `Maaari kitang tulungan sa:\nMga latest announcement mula sa barangay\nMga emergency alert at impormasyon\nMga serbisyo ng barangay (clearance, ID, certificates)\nContact information at office hours\nLocation at direksyon\n\nAno po ang gusto ninyong malaman?`,
    BISAYA: `Makatabang ko nimo sa:\nMga bag-ong announcement gikan sa barangay\nMga emergency alert ug impormasyon\nMga serbisyo sa barangay (clearance, ID, certificates)\nContact information ug office hours\nLocation ug direksyon\n\nUnsa ang gusto nimong masayran?`,
    TAGLISH: `I can help you with:\nLatest announcements from the barangay\nEmergency alerts and information\nBarangay services (clearance, ID, certificates)\nContact information at office hours\nLocation and directions\n\nAno ang gusto mong malaman?`
  }[lang];
}

export function getNoInfoResponse(lang: Language): string {
  return {
    ENGLISH: "I don't have that information right now. Please visit the Barangay Hall or call (032) 123-4567 for assistance.",
    TAGALOG: "Wala po akong impormasyon tungkol diyan. Mangyaring pumunta sa Barangay Hall o tumawag sa (032) 123-4567 para sa tulong.",
    BISAYA: "Wala koy impormasyon bahin ana. Palihug adto sa Barangay Hall o tawag sa (032) 123-4567 para sa tabang.",
    TAGLISH: "Wala akong info about diyan. Please visit the Barangay Hall o call (032) 123-4567 para sa assistance."
  }[lang];
}

export function getUnknownQueryResponse(lang: Language): string {
  return {
    ENGLISH: "I'm not sure I understand. Could you rephrase that? Or you can ask me about announcements, services, contact info, or emergencies.",
    TAGALOG: "Hindi ko po masyadong naintindihan. Pwede po ba ulitin? O pwede po kayong magtanong tungkol sa announcement, serbisyo, contact info, o emergency.",
    BISAYA: "Dili ko masabot. Puwede ba nimong uliton? O puwede ka mangutana bahin sa announcement, serbisyo, contact info, o emergency.",
    TAGLISH: "Di ko masyadong gets. Pwede ba ulitin? O you can ask me about announcements, services, contact info, o emergency."
  }[lang];
}

export default {
  detectLanguage, getLanguageInstruction, getWelcomeMessage, getQuickReplies,
  getFallbackResponse, getContactResponse, getOfficeHoursResponse, getEmergencyResponse,
  getThanksResponse, getFarewellResponse, getHelpMessage, getNoInfoResponse, getUnknownQueryResponse
};
