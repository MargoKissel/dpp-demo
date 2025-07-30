import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton } from '@/components/EcoButton';
import Image from 'next/image';

// The product page is rendered dynamically for each SKU.  We perform
// translation and formatting logic directly in this component so that
// the digital passport looks polished even if the underlying data
// coming from the Google Sheet is a bit rough.  Material and country
// names are translated into German, CO₂ values are formatted with
// a dot as decimal separator, and fallback images are provided via
// an internal mapping.

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60;

// Simple translation tables.  Extend these tables as you add new
// materials or countries to your spreadsheet.
const materialTranslations: Record<string, string> = {
  Cotton: 'Baumwolle',
  Denim: 'Denim',
  Leather: 'Leder',
  'Li-Ion': 'Li‑Ion',
};

const countryTranslations: Record<string, string> = {
  Turkey: 'Türkei',
  Tunisia: 'Tunesien',
  Germany: 'Deutschland',
  Spain: 'Spanien',
  China: 'China',
};

// Fallback images for specific SKUs.  If your API doesn’t return an
// image_url field for a product you can assign one here.  For
// instance, SKU 1001 displays a plain white T‑shirt.  Use the same
// pattern to add images for your other products.
const imageMap: Record<string, string> = {
  '1001':
    'https://drive.google.com/uc?id=1Qx8w1cesLrwg6m0UZm_NUp1txI933qXA',
};

export async function generateMetadata({ params }: any) {
  const { sku } = await params;
  return {
    title: `Digital Product Passport – SKU ${sku}`,
    description: `Digitaler Produktpass für Artikel mit der SKU ${sku}.`,
  };
}

export default async function ProductPage({ params }: any) {
  const { sku } = params;
  let product: any;

  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('not-found');
  } catch (err: any) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>{err.message}</p>
      </main>
    );
  }

  // Translate fields when possible.  Fallback to the original value
  // if we don’t have a translation.  This keeps the UI robust.
  const translatedMaterial =
    materialTranslations[product.material] ?? product.material;
  const translatedCountry =
    countryTranslations[product.country] ?? product.country;

  // Format CO₂ emission values with a dot as decimal separator and
  // exactly three decimal places.  We deliberately avoid
  // locale‑based formatting here because the design in Figma uses a
  // dot rather than a comma.
  const co2 = Number(product.co2_kg)
    .toFixed(3)
    .replace(/,/g, '.');

  // Determine which image to display.  Prefer the value coming from
  // the backend; otherwise fall back to our internal mapping.
  const image = product.image_url || imageMap[sku] || null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {image && (
          <div className="relative w-full h-64 sm:h-72 md:h-80">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain bg-gray-100"
              unoptimized
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-4 text-gray-900">
            {product.name}
          </h1>

          <div className="space-y-2 mb-4 text-lg">
            <p>
              <span className="font-semibold text-gray-900">Material:&nbsp;</span>
              <span className="text-gray-700">{translatedMaterial}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Herstellungsland:&nbsp;
              </span>
              <span className="text-gray-700">{translatedCountry}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                CO₂‑Fußabdruck:&nbsp;
              </span>
              <span className="text-gray-700">{co2}&nbsp;kg CO₂</span>
            </p>
          </div>

          <p className="mb-6 text-gray-700 leading-relaxed">
            Dieses {product.name} wurde aus {translatedMaterial} in {translatedCountry}{' '}
            gefertigt. Die Kohlendioxid‑Emissionen belaufen sich auf {co2}
            &nbsp;kg CO₂.
          </p>

          {/* The EcoButton component uses local storage to ensure that the button
              disappears after the user has claimed their Eco‑Punkte.  The
              underlying component has been tweaked to better match the Figma
              design (see EcoButton.tsx). */}
          <EcoButton sku={sku} />
        </div>
      </div>
    </div>
  );
}
