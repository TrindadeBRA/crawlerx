import { NextRequest } from "next/server";
import { ScrapingController } from "./controllers/scraping.controller";

const scrapingController = new ScrapingController();

export async function POST(request: NextRequest) {
  return scrapingController.scrape(request);
} 