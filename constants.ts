import { TopicData } from './types';

export const PREDEFINED_TOPICS: TopicData = {
  "hälsningar": [ 
    { id: "predef_greet1", topic: "hälsningar", swedish: "Hej!", persian: "سلام!" },
    { id: "predef_greet2", topic: "hälsningar", swedish: "God morgon!", persian: "صبح بخیر!" },
    { id: "predef_greet3", topic: "hälsningar", swedish: "Hur mår du?", persian: "حال شما چطور است؟" },
  ],
  "restaurang": [ 
    { id: "predef_rest1", topic: "restaurang", swedish: "Ett bord för två, tack.", persian: "یک میز برای دو نفر، لطفاً." },
    { id: "predef_rest2", topic: "restaurang", swedish: "Vad rekommenderar du?", persian: "چه چیزی را پیشنهاد می کنید؟" },
    { id: "predef_rest3", topic: "restaurang", swedish: "Notan, tack.", persian: "صورتحساب، لطفاً." },
  ],
  "väder": [
    { id: "predef_weather1", topic: "väder", swedish: "Hur är vädret idag?", persian: "امروز هوا چطور است؟" },
    { id: "predef_weather2", topic: "väder", swedish: "Det är soligt.", persian: "هوا آفتابی است." },
    { id: "predef_weather3", topic: "väder", swedish: "Kommer det att regna?", persian: "آیا باران خواهد آمد؟" },
  ]
};

export const GEMINI_API_MODEL = 'gemini-2.5-flash';

export const APP_NAME = "Lär Dig Svenska";