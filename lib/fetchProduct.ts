export async function fetchProduct(sku: string) {
  const url = \`\${process.env.SHEETS_API}?sku=\${sku}&key=\${process.env.SHEETS_API_KEY}\`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return (await res.json()) as {
    sku: string;
    name: string;
    material: string;
    country: string;
    co2_kg: string;
    marketing_claim: string;
    last_modified: string;
    rule_status: string;
    warning_reason?: string;
    row_hash: string;
  };
}
