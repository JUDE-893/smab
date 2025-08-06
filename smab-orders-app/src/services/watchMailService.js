import { authorize } from './googleService.js'
import { watchEmails } from './mailServices.js'
import logger from "../utils/logger.js";


// Application entry point
export default async function watchMailService(app) {
    try {
    //   await listPrinters();
      const auth = await authorize(app);
      logger.info("Monitoring for new emails...");
      await watchEmails(auth,app);
    } catch (error) {
      logger.error("Application error:", error.message);
    }
  };
