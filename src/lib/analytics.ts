import { addToHistory, getClicks } from "./db";

export async function updateAnalytics() {
  const clicks = await getClicks();
  await addToHistory(clicks);
  console.log("Updated analytics", new Date());
}
