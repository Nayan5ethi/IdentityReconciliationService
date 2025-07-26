import { PrismaClient } from "@prisma/client";
import config from "config";

const { LOG_SQL, NODE_ENV } = config;

declare global {
  var __prisma: PrismaClient | undefined;
}

class PrismaSingleton {
  private static instance: PrismaClient | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: LOG_SQL ? ["query"] : [],
      });

      if (NODE_ENV === "development") {
        global.__prisma = PrismaSingleton.instance;
      }
    }

    return PrismaSingleton.instance;
  }
}

export const prisma = global.__prisma || PrismaSingleton.getInstance();
