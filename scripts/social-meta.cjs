module.exports = function socialMeta(env = process.env) {
  const source = env.SITE_URL || ((env.CONTEXT && env.CONTEXT !== 'production') ? env.DEPLOY_PRIME_URL : env.URL) || env.URL;
  let base;
  if (source) {
    base = new URL(source);
    if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password) throw Error('SITE_URL must be an HTTP(S) site address without credentials.');
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image = base ? new URL('/og-image.png', base).href : '/og-image.png';
  const tags = {
    'og:type': 'website', 'og:site_name': 'Nav Bharat Enterprises',
    'og:title': 'Nav Bharat — Solar Quotation Workspace',
    'og:description': 'Prepare solar quotations, review equipment and pricing, and share a clear PDF proposal.',
    'og:image': image, 'og:image:type': 'image/png',
    'og:image:width': '1200', 'og:image:height': '630',
    'og:image:alt': 'Nav Bharat Enterprises solar quotation workspace, with a solar mark and proposal illustration.'
  };
  if (base) tags['og:url'] = new URL('/', base).href;
  return Object.entries(tags).map(([key,value]) => `<meta property="${key}" content="${esc(value)}">`).join('\n') +
    `\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(tags['og:title'])}">\n<meta name="twitter:description" content="${esc(tags['og:description'])}">\n<meta name="twitter:image" content="${esc(image)}">\n<meta name="twitter:image:alt" content="${esc(tags['og:image:alt'])}">`;
};
