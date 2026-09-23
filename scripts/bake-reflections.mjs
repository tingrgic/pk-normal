import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("http://localhost:5173");
  const result = await page.evaluate(async () => {
    const { bakeReflections } = await import("/scripts/reflection-baker.ts");
    return bakeReflections();
  });
  writeFileSync(
    "public/studio-reflections.png",
    Buffer.from(result.png, "base64"),
  );
  console.log(result.width, result.height);
} finally {
  await browser.close();
}
