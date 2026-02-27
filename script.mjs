import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const productsPath = path.join(__dirname, "lib/data/products.json");

const publicDir = path.join(__dirname, "public/raw-images");

const outputDir = path.join(__dirname, "public/catalog");

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to create filename-safe string
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Load products
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

for (const product of products) {
  if (!product.image || product.image.trim() === "") {
    const fileBaseName = slugify(product.item);

    // Try common extensions
    const possibleExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

    let foundPath = null;

    for (const ext of possibleExtensions) {
      const fullPath = path.join(publicDir, `${fileBaseName}${ext}`);
      if (fs.existsSync(fullPath)) {
        foundPath = fullPath;
        break;
      }
    }

    if (!foundPath) {
      console.log(`❌ No image found for: ${product.item}`);
      continue;
    }

    const outputFileName = `${fileBaseName}.avif`;
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await sharp(foundPath)
        .resize(800) // optional resize
        .avif({ quality: 80 })
        .toFile(outputPath);

      product.image = `/catalog/${outputFileName}`;

      console.log(`✅ Optimized: ${product.item}`);
    } catch (err) {
      console.error(`❌ Error processing ${product.item}`, err);
    }
  }
}

// Save updated JSON
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log("🎉 Done processing products!");
