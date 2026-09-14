"""Seed the six-coffee catalog. Idempotent — safe to re-run."""

from django.core.management.base import BaseCommand

from shop.models import Product

CATALOG = [
    {
        "sku": "cloud-forest",
        "name": "Cloud Forest",
        "origin": "Ethiopia",
        "region": "Guji Highlands",
        "roast": "light",
        "process": "Natural · 21-day raised beds",
        "varietal": "Heirloom cultivars",
        "altitude": "2,100 m.a.s.l.",
        "notes": ["jasmine", "bergamot", "wild honey"],
        "price": "24.00",
        "weight": "250 g",
        "roast_level": 2,
        "cup_score": "91.0",
        "badge": "Limited — 40 bags",
        "description": (
            "A perfumed, tea-like natural from a single washing station above the "
            "Harenna forest. We took this lot barely past first crack to keep every "
            "floral volatile intact."
        ),
        "story": (
            "Dried on raised beds for three weeks under Guji's thin highland air, this "
            "heirloom lot cupped at 91 the first time we tasted it — we bought the "
            "entire micro-lot on the spot."
        ),
        "image": "https://image.qwenlm.ai/generated-images/3051eb3c-1d3d-459d-9080-9898f9142372/_result.png",
    },
    {
        "sku": "kiamugumu-aa",
        "name": "Kiamugumu AA",
        "origin": "Kenya",
        "region": "Kirinyaga County",
        "roast": "light",
        "process": "Washed · double fermented",
        "varietal": "SL28 & SL34",
        "altitude": "1,750–1,900 m.a.s.l.",
        "notes": ["blackcurrant", "grapefruit", "demerara"],
        "price": "21.50",
        "weight": "250 g",
        "roast_level": 2,
        "cup_score": "89.5",
        "badge": "New crop",
        "description": (
            "Classic Kirinyaga electricity: a syrupy blackcurrant core wrapped in "
            "grapefruit acidity and a long demerara finish. Bright without ever being sharp."
        ),
        "story": (
            "Grown on red volcanic soils by 900 smallholders around the Kiamugumu "
            "factory, this AA screen size landed in Portland six weeks after milling."
        ),
        "image": "https://image.qwenlm.ai/generated-images/b01c3799-3d45-46a6-970c-1da58bb77724/_result.png",
    },
    {
        "sku": "flor-del-alba",
        "name": "Flor del Alba",
        "origin": "Colombia",
        "region": "Huila — San Agustín",
        "roast": "medium",
        "process": "Washed · 18 h fermentation",
        "varietal": "Caturra & Castillo",
        "altitude": "1,650 m.a.s.l.",
        "notes": ["caramel", "red apple", "cacao nib"],
        "price": "19.00",
        "weight": "250 g",
        "roast_level": 3,
        "cup_score": "87.0",
        "badge": "Best seller",
        "description": (
            "The coffee we reach for when someone asks “what should I brew every day?” "
            "Round caramel sweetness, clean apple acidity, a dusting of cacao."
        ),
        "story": (
            "From the Muñoz family's fourth-generation farm, Finca La Esperanza. We've "
            "bought this same hillside lot for five consecutive harvests."
        ),
        "image": "https://image.qwenlm.ai/generated-images/82fa803c-5d7f-4ff7-873f-517cbb997fa4/_result.png",
    },
    {
        "sku": "ember-blend",
        "name": "Ember Blend",
        "origin": "Brazil + Ethiopia",
        "region": "Cerrado & Sidama",
        "roast": "medium",
        "process": "Natural + pulped natural",
        "varietal": "Mundo Novo & 74158",
        "altitude": "1,150–1,950 m.a.s.l.",
        "notes": ["milk chocolate", "toasted almond", "maple"],
        "price": "16.50",
        "weight": "250 g",
        "roast_level": 4,
        "cup_score": "86.5",
        "badge": "Espresso pick",
        "description": (
            "Our house espresso, built to stand up to milk: bittersweet chocolate body, "
            "toasted-almond mid-palate, and a maple-syrup close that lingers."
        ),
        "story": (
            "Roasted a touch further and rested five days before shipping, so it pulls "
            "sweet and syrupy from day one in your portafilter."
        ),
        "image": "https://image.qwenlm.ai/generated-images/dad5c5b0-ae30-4d56-b430-e0e7047a50ec/_result.png",
    },
    {
        "sku": "midnight-kiln",
        "name": "Midnight Kiln",
        "origin": "Indonesia",
        "region": "Aceh — Gayo Highlands",
        "roast": "dark",
        "process": "Wet-hulled (giling basah)",
        "varietal": "Ateng & Jember",
        "altitude": "1,400–1,600 m.a.s.l.",
        "notes": ["dark chocolate", "cedar", "molasses"],
        "price": "18.00",
        "weight": "250 g",
        "roast_level": 5,
        "cup_score": "85.0",
        "badge": "",
        "description": (
            "A brooding Sumatra pushed just to the edge of second crack. Heavy, "
            "resinous, and smoldering — dark chocolate and cedar over a molasses base."
        ),
        "story": (
            "Wet-hulled the traditional Gayo way, which gives the bean its signature "
            "dark jade hue and that unmistakable deep, savory sweetness."
        ),
        "image": "https://image.qwenlm.ai/generated-images/cc4b2cbc-a2f8-442a-ab1c-796c368b0821/_result.png",
    },
    {
        "sku": "quiet-hours",
        "name": "Quiet Hours",
        "origin": "Colombia",
        "region": "Cauca — Popayán",
        "roast": "decaf",
        "process": "Sugarcane E.A. decaffeination",
        "varietal": "Castillo",
        "altitude": "1,800 m.a.s.l.",
        "notes": ["toffee", "hazelnut", "orange zest"],
        "price": "17.50",
        "weight": "250 g",
        "roast_level": 3,
        "cup_score": "84.5",
        "badge": "Evening cup",
        "description": (
            "A decaf nobody clocks as decaf. Sugarcane processing keeps the "
            "toffee-and-hazelnut sweetness fully intact, with a flick of orange zest "
            "at the end."
        ),
        "story": (
            "Decaffeinated in Colombia, hours from where it was grown, using ethanol "
            "derived from local sugarcane — gentle on the bean, gentle on your night."
        ),
        "image": "https://image.qwenlm.ai/generated-images/5e93da36-abdc-4b15-b3f0-ff27961b2324/_result.png",
    },
]


class Command(BaseCommand):
    help = "Seed the six-coffee Ember & Oak catalog (idempotent)."

    def handle(self, *args, **options):
        for i, data in enumerate(CATALOG):
            sku = data.pop("sku")
            product, created = Product.objects.update_or_create(
                sku=sku, defaults={**data, "sort_order": i}
            )
            verb = "Created" if created else "Updated"
            self.stdout.write(f"  {verb} {product.sku} - {product.name}")
        self.stdout.write(self.style.SUCCESS(f"Catalog ready: {len(CATALOG)} coffees."))
