import path from "node:path";
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSansJP",
  src: path.join(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf"),
});

Font.registerHyphenationCallback((word) => [word]);
