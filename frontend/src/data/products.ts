export type RoastCategory = 'light' | 'medium' | 'dark' | 'decaf';

export interface Product {
  id: string;
  name: string;
  origin: string;
  region: string;
  category: RoastCategory;
  categoryLabel: string;
  process: string;
  varietal: string;
  altitude: string;
  notes: [string, string, string];
  price: number;
  weight: string;
  roastLevel: number; // 1–5
  cupScore: number;
  badge?: string;
  description: string;
  story: string;
  image: string;
}

export const GRINDS = ['Whole bean', 'Filter', 'Espresso'] as const;
export type Grind = (typeof GRINDS)[number];

export const FREE_SHIPPING_THRESHOLD = 40;
export const SHIPPING_FLAT = 6;

export const fmt = (n: number) => `$${n.toFixed(2)}`;

export const PRODUCTS: Product[] = [
  {
    id: 'cloud-forest',
    name: 'Cloud Forest',
    origin: 'Ethiopia',
    region: 'Guji Highlands',
    category: 'light',
    categoryLabel: 'Light roast',
    process: 'Natural · 21-day raised beds',
    varietal: 'Heirloom cultivars',
    altitude: '2,100 m.a.s.l.',
    notes: ['jasmine', 'bergamot', 'wild honey'],
    price: 24,
    weight: '250 g',
    roastLevel: 2,
    cupScore: 91,
    badge: 'Limited — 40 bags',
    description:
      'A perfumed, tea-like natural from a single washing station above the Harenna forest. We took this lot barely past first crack to keep every floral volatile intact.',
    story:
      'Dried on raised beds for three weeks under Guji\u2019s thin highland air, this heirloom lot cupped at 91 the first time we tasted it — we bought the entire micro-lot on the spot.',
    image: 'https://image.qwenlm.ai/generated-images/3051eb3c-1d3d-459d-9080-9898f9142372/_result.png',
  },
  {
    id: 'kiamugumu-aa',
    name: 'Kiamugumu AA',
    origin: 'Kenya',
    region: 'Kirinyaga County',
    category: 'light',
    categoryLabel: 'Light roast',
    process: 'Washed · double fermented',
    varietal: 'SL28 & SL34',
    altitude: '1,750–1,900 m.a.s.l.',
    notes: ['blackcurrant', 'grapefruit', 'demerara'],
    price: 21.5,
    weight: '250 g',
    roastLevel: 2,
    cupScore: 89.5,
    badge: 'New crop',
    description:
      'Classic Kirinyaga electricity: a syrupy blackcurrant core wrapped in grapefruit acidity and a long demerara finish. Bright without ever being sharp.',
    story:
      'Grown on red volcanic soils by 900 smallholders around the Kiamugumu factory, this AA screen size landed in Portland six weeks after milling.',
    image: 'https://image.qwenlm.ai/generated-images/b01c3799-3d45-46a6-970c-1da58bb77724/_result.png',
  },
  {
    id: 'flor-del-alba',
    name: 'Flor del Alba',
    origin: 'Colombia',
    region: 'Huila — San Agustín',
    category: 'medium',
    categoryLabel: 'Medium roast',
    process: 'Washed · 18 h fermentation',
    varietal: 'Caturra & Castillo',
    altitude: '1,650 m.a.s.l.',
    notes: ['caramel', 'red apple', 'cacao nib'],
    price: 19,
    weight: '250 g',
    roastLevel: 3,
    cupScore: 87,
    badge: 'Best seller',
    description:
      'The coffee we reach for when someone asks \u201Cwhat should I brew every day?\u201D Round caramel sweetness, clean apple acidity, a dusting of cacao.',
    story:
      'From the Muñoz family\u2019s fourth-generation farm, Finca La Esperanza. We\u2019ve bought this same hillside lot for five consecutive harvests.',
    image: 'https://image.qwenlm.ai/generated-images/82fa803c-5d7f-4ff7-873f-517cbb997fa4/_result.png',
  },
  {
    id: 'ember-blend',
    name: 'Ember Blend',
    origin: 'Brazil + Ethiopia',
    region: 'Cerrado & Sidama',
    category: 'medium',
    categoryLabel: 'Medium roast',
    process: 'Natural + pulped natural',
    varietal: 'Mundo Novo & 74158',
    altitude: '1,150–1,950 m.a.s.l.',
    notes: ['milk chocolate', 'toasted almond', 'maple'],
    price: 16.5,
    weight: '250 g',
    roastLevel: 4,
    cupScore: 86.5,
    badge: 'Espresso pick',
    description:
      'Our house espresso, built to stand up to milk: bittersweet chocolate body, toasted-almond mid-palate, and a maple-syrup close that lingers.',
    story:
      'Roasted a touch further and rested five days before shipping, so it pulls sweet and syrupy from day one in your portafilter.',
    image: 'https://image.qwenlm.ai/generated-images/dad5c5b0-ae30-4d56-b430-e0e7047a50ec/_result.png',
  },
  {
    id: 'midnight-kiln',
    name: 'Midnight Kiln',
    origin: 'Indonesia',
    region: 'Aceh — Gayo Highlands',
    category: 'dark',
    categoryLabel: 'Dark roast',
    process: 'Wet-hulled (giling basah)',
    varietal: 'Ateng & Jember',
    altitude: '1,400–1,600 m.a.s.l.',
    notes: ['dark chocolate', 'cedar', 'molasses'],
    price: 18,
    weight: '250 g',
    roastLevel: 5,
    cupScore: 85,
    description:
      'A brooding Sumatra pushed just to the edge of second crack. Heavy, resinous, and smoldering — dark chocolate and cedar over a molasses base.',
    story:
      'Wet-hulled the traditional Gayo way, which gives the bean its signature dark jade hue and that unmistakable deep, savory sweetness.',
    image: 'https://image.qwenlm.ai/generated-images/cc4b2cbc-a2f8-442a-ab1c-796c368b0821/_result.png',
  },
  {
    id: 'quiet-hours',
    name: 'Quiet Hours',
    origin: 'Colombia',
    region: 'Cauca — Popayán',
    category: 'decaf',
    categoryLabel: 'Decaf',
    process: 'Sugarcane E.A. decaffeination',
    varietal: 'Castillo',
    altitude: '1,800 m.a.s.l.',
    notes: ['toffee', 'hazelnut', 'orange zest'],
    price: 17.5,
    weight: '250 g',
    roastLevel: 3,
    cupScore: 84.5,
    badge: 'Evening cup',
    description:
      'A decaf nobody clocks as decaf. Sugarcane processing keeps the toffee-and-hazelnut sweetness fully intact, with a flick of orange zest at the end.',
    story:
      'Decaffeinated in Colombia, hours from where it was grown, using ethanol derived from local sugarcane — gentle on the bean, gentle on your night.',
    image: 'https://image.qwenlm.ai/generated-images/5e93da36-abdc-4b15-b3f0-ff27961b2324/_result.png',
  },
];

export const CATEGORY_FILTERS: { id: RoastCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All coffees' },
  { id: 'light', label: 'Light roast' },
  { id: 'medium', label: 'Medium roast' },
  { id: 'dark', label: 'Dark roast' },
  { id: 'decaf', label: 'Decaf' },
];
