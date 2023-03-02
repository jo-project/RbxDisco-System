declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_DB: string;
        TOKEN: string;
        WEATHER_KEY: string
        TIMEZONE_KEY: string;
        GITHUB_KEY: string;
        OWNER_ID: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
export {}