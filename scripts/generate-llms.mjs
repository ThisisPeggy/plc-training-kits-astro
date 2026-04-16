import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const productsFile = path.join(root, 'src', 'data', 'products.ts');
const publicDir = path.join(root, 'public');
const source = fs.readFileSync(productsFile, 'utf8');

function unescapeValue(value) {
  return value.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

function parseCategories(text) {
  const categorySectionMatch = text.match(/export const categories: CategoryMeta\[\] = \[(.*?)\];/s);
  if (!categorySectionMatch) {
    throw new Error('Could not find categories array.');
  }

  const categoryBlockRegex = /\{\s*slug: '([^']+)',\s*category: '([^']+)',\s*title: '([^']+)',\s*pageTitle: '([^']+)',\s*description: '([^']+)',\s*intro: '([^']+)'/gs;
  const categories = [];

  for (const match of categorySectionMatch[1].matchAll(categoryBlockRegex)) {
    categories.push({
      slug: unescapeValue(match[1]),
      category: unescapeValue(match[2]),
      title: unescapeValue(match[3]),
      pageTitle: unescapeValue(match[4]),
      description: unescapeValue(match[5]),
      intro: unescapeValue(match[6]),
    });
  }

  return categories;
}

function parseProducts(text) {
  const productSectionMatch = text.match(/export const products: Product\[\] = \[(.*)\];/s);
  if (!productSectionMatch) {
    throw new Error('Could not find products array.');
  }

  const productText = productSectionMatch[1];
  const productBlockRegex = /\{\s*slug: '([^']+)',\s*name: '([^']+)',\s*shortName: '([^']+)',\s*brand: '([^']+)',\s*series: '([^']+)',\s*category: '([^']+)',\s*sku: '([^']+)',\s*priceLabel: '([^']+)',\s*priceValue: [^,]+,\s*image: [^,]+,\s*intro: '([^']+)',\s*description: '([^']+)'/gs;
  const products = [];

  for (const match of productText.matchAll(productBlockRegex)) {
    const blockStart = match.index ?? 0;
    const nextBlockStart = productText.indexOf('\n  {', blockStart + 1);
    const block = productText.slice(blockStart, nextBlockStart === -1 ? undefined : nextBlockStart);
    const audienceMatch = block.match(/audience: '([^']+)'/s);

    products.push({
      slug: unescapeValue(match[1]),
      name: unescapeValue(match[2]),
      shortName: unescapeValue(match[3]),
      brand: unescapeValue(match[4]),
      series: unescapeValue(match[5]),
      category: unescapeValue(match[6]),
      sku: unescapeValue(match[7]),
      priceLabel: unescapeValue(match[8]),
      intro: unescapeValue(match[9]),
      description: unescapeValue(match[10]),
      audience: audienceMatch ? unescapeValue(audienceMatch[1]) : '',
    });
  }

  return products;
}

const categories = parseCategories(source);
const products = parseProducts(source);

if (products.length === 0) {
  throw new Error('No products were parsed from products.ts');
}

const siteUrl = 'https://plc-training-kits.tech';
const companyName = 'Kernal Automation - SI Dept.';
const contactLine = 'Peggy Chan - peggy@kernal-automation.com | WhatsApp: +86 176 1205 1841';
const companyIntro = 'Kernal Automation Co., Ltd. - System Integration Department sells pre-wired, ready-to-use PLC training kits with complete documentation, wiring diagrams, and training videos. We ship to 15+ countries via DHL/FedEx (5-7 days express). All kits include a 1-year warranty.';
const demoPage = {
  title: 'Watch Demo',
  url: `${siteUrl}/watch-demo/`,
  summary: 'Dedicated video demo page for the Allen-Bradley Micro850 training kit, with on-site playback and direct catalog/contact actions.',
  videoTitle: 'Allen-Bradley Micro850 Training Kit Demo',
  videoUrl: `${siteUrl}/videos/ab850-demo.mp4`,
};

const groupedProducts = categories.map((category) => ({
  ...category,
  items: products.filter((product) => product.category === category.category),
}));

const llmsLines = [
  `# ${companyName}`,
  '',
  '> Professional PLC training kits and control cabinets for schools, labs, and enterprise training centers. Siemens S7-1200, Mitsubishi FX5U, and Allen-Bradley Micro850 platforms.',
  '',
  '## About',
  '',
  companyIntro,
  '',
  `Contact: ${contactLine}`,
  '',
  '## Products',
  '',
];

for (const group of groupedProducts) {
  llmsLines.push(`### ${group.title}`);
  llmsLines.push('');
  for (const item of group.items) {
    llmsLines.push(`- [${item.name}](${siteUrl}/products/${item.slug}/): ${item.priceLabel}`);
  }
  llmsLines.push('');
}

llmsLines.push('## Services');
llmsLines.push('');
llmsLines.push('- PLC Programming Service (Siemens TIA Portal, Mitsubishi GX Works, HMI design)');
llmsLines.push('- Automation Software Sales (licensed Siemens, Mitsubishi software)');
llmsLines.push('- Custom Kit Design (curriculum-matched, component customization, bulk orders)');
llmsLines.push('');
llmsLines.push('## Demo');
llmsLines.push('');
llmsLines.push(`- [${demoPage.title}](${demoPage.url}): ${demoPage.summary}`);
llmsLines.push(`- Featured video: ${demoPage.videoTitle}`);
llmsLines.push('');
llmsLines.push('## Pages');
llmsLines.push('');
llmsLines.push(`- [Home](${siteUrl}/)`);
llmsLines.push(`- [${demoPage.title}](${demoPage.url})`);
llmsLines.push(`- [About](${siteUrl}/about/)`);
llmsLines.push(`- [FAQ](${siteUrl}/faq/)`);
llmsLines.push(`- [Services](${siteUrl}/services/)`);
for (const group of groupedProducts) {
  llmsLines.push(`- [${group.title}](${siteUrl}/products/${group.slug}/)`);
}
llmsLines.push('');

const llmsFullLines = [
  `# ${companyName} (Full Product Guide)`,
  '',
  '> Professional PLC training kits and control cabinets for schools, labs, and enterprise training centers.',
  '',
  '## About',
  '',
  companyIntro,
  '',
  '- Company: Kernal Automation Co., Ltd.',
  '- Location: Dongguan, Guangdong, China',
  `- Contact: ${contactLine}`,
  `- Website: ${siteUrl}`,
  '- LinkedIn: https://www.linkedin.com/company/kernal-automation-co-limited/',
  '- YouTube: https://www.youtube.com/@PeggyinKernal',
  '',
  '## Categories',
  '',
];

for (const group of groupedProducts) {
  llmsFullLines.push(`### ${group.title}`);
  llmsFullLines.push(`- Category URL: ${siteUrl}/products/${group.slug}/`);
  llmsFullLines.push(`- Description: ${group.description}`);
  llmsFullLines.push(`- Overview: ${group.intro}`);
  llmsFullLines.push('');
}

llmsFullLines.push('## Products');
llmsFullLines.push('');

for (const item of products) {
  llmsFullLines.push(`### ${item.name}`);
  llmsFullLines.push(`- URL: ${siteUrl}/products/${item.slug}/`);
  llmsFullLines.push(`- Price: ${item.priceLabel}`);
  llmsFullLines.push(`- SKU: ${item.sku}`);
  llmsFullLines.push(`- Brand: ${item.brand}`);
  llmsFullLines.push(`- Series: ${item.series}`);
  llmsFullLines.push(`- Category: ${item.category}`);
  llmsFullLines.push(`- Intro: ${item.intro}`);
  llmsFullLines.push(`- Description: ${item.description}`);
  if (item.audience) {
    llmsFullLines.push(`- Audience: ${item.audience}`);
  }
  llmsFullLines.push('- Includes: Pre-wired hardware, user manual, wiring diagrams, training videos, and warranty/support as listed on the product page');
  llmsFullLines.push('');
}

llmsFullLines.push('## Services');
llmsFullLines.push('');
llmsFullLines.push('- PLC Programming: Siemens TIA Portal, Mitsubishi GX Works 3, AB CCW, HMI Design');
llmsFullLines.push('- Automation Software: Licensed Siemens/Mitsubishi software sales');
llmsFullLines.push('- Custom Kit Design: Curriculum-matched, component customization, bulk orders');
llmsFullLines.push('');
llmsFullLines.push('## Demo');
llmsFullLines.push('');
llmsFullLines.push(`### ${demoPage.title}`);
llmsFullLines.push(`- URL: ${demoPage.url}`);
llmsFullLines.push(`- Summary: ${demoPage.summary}`);
llmsFullLines.push(`- Video: ${demoPage.videoTitle}`);
llmsFullLines.push(`- Video File: ${demoPage.videoUrl}`);
llmsFullLines.push('- Notes: This page is intended as a clean on-site product demonstration entry point for buyers reviewing the Allen-Bradley Micro850 platform.');
llmsFullLines.push('');
llmsFullLines.push('## Ordering');
llmsFullLines.push('');
llmsFullLines.push(`- Contact: ${contactLine}`);
llmsFullLines.push('- Shipping: DHL/FedEx 5-7 days | Air 7-14 days | Sea 30-45 days');
llmsFullLines.push('- Payment: T/T, PayPal, Alipay');
llmsFullLines.push('');

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsLines.join('\n'));
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullLines.join('\n'));

console.log(`Generated llms.txt and llms-full.txt for ${products.length} products.`);
