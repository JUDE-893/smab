import { authorize } from './googleService.js'
import { watchEmails } from './mailServices.js'
import logger from "../utils/logger.js";


// Application entry point
export default async function watchMailService() {
    try {
    //   await listPrinters();
      const auth = await authorize();
      logger.info("Monitoring for new emails...");
      await watchEmails(auth);
    } catch (error) {
      logger.error("Application error:", error.message);
    }
  };
  