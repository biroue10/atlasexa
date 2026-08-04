import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BUDGET_BYTES = 260_000;
const ASSETS_DIR = "dist/assets";

function findJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      return findJavaScriptFiles(path);
    }

    return path.endsWith(".js") ? [path] : [];
  });
}

const files = findJavaScriptFiles(ASSETS_DIR);

if (files.length === 0) {
  console.error("No JavaScript files found. Run the production build first.");
  process.exit(1);
}

const results = files.map((file) => {
  const gzipBytes = gzipSync(readFileSync(file)).length;

  return {
    file,
    gzipBytes,
  };
});

const totalGzipBytes = results.reduce(
  (total, result) => total + result.gzipBytes,
  0,
);

console.log("\nInitial JavaScript performance budget\n");

for (const result of results) {
  console.log(
    `${result.file}: ${(result.gzipBytes / 1024).toFixed(2)} KiB gzip`,
  );
}

console.log(
  `\nTotal: ${(totalGzipBytes / 1024).toFixed(2)} KiB gzip`,
);
console.log(
  `Budget: ${(BUDGET_BYTES / 1024).toFixed(2)} KiB gzip`,
);

if (totalGzipBytes > BUDGET_BYTES) {
  console.error(
    `\nPerformance budget exceeded by ${(
      (totalGzipBytes - BUDGET_BYTES) /
      1024
    ).toFixed(2)} KiB.`,
  );

  process.exit(1);
}

console.log("\nPerformance validation passed.");
