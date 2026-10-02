"""Extract owner-supplied artwork and preserve its circle/photo cover language.
Run with PyMuPDF and Pillow. No web assets, recreated logos, or client text.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import pymupdf, io, base64, json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('/Users/mj/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/8D6E14EE-2DE0-4E1D-839F-AF9130FD0BD1/Nav Bharat Enterprises - Solar Quotation 45-2026 (with Battery row)-6.pdf')
doc=pymupdf.open(SOURCE)
out=ROOT/'assets';out.mkdir(exist_ok=True)
def image(x):return Image.open(io.BytesIO(doc.extract_image(x)['image'])).convert('RGB')
W,H=1600,760
canvas=Image.new('RGB',(W,H),'white')
# Same source photo band and overlapping circular solar photographs, re-spaced.
base=ImageOps.fit(image(271),(W,390),method=Image.Resampling.LANCZOS,centering=(.5,.4))
canvas.paste(base,(0,370))
def circle(x,y,size,photo):
    im=ImageOps.fit(photo,(size,size),method=Image.Resampling.LANCZOS)
    mask=Image.new('L',(size,size),0);ImageDraw.Draw(mask).ellipse((0,0,size-1,size-1),fill=255)
    canvas.paste(im,(x,y),mask)
# Retain source blue sweeping accent, inset to avoid overwhelming the customer.
wave_info=next(x for x in doc[0].get_images(full=True) if x[0]==89)
wave_pix=pymupdf.Pixmap(doc,89)
if wave_info[1]:wave_pix=pymupdf.Pixmap(wave_pix,pymupdf.Pixmap(doc,wave_info[1]))
wave=Image.open(io.BytesIO(wave_pix.tobytes('png'))).convert('RGBA');wave.thumbnail((800,330),Image.Resampling.LANCZOS)
canvas.paste(wave,(0,370),wave)
circle(900,5,705,image(269));circle(240,225,700,image(270))
canvas.save(out/'solar-cover.jpg',quality=90,optimize=True)
# Rasterize the existing four-mark strip together: do not redraw ministry logos.
strip=doc[0].get_pixmap(matrix=pymupdf.Matrix(3,3),clip=pymupdf.Rect(8,658,601,744),alpha=False)
strip.save(str(out/'original-identity-strip.png'))
assets={}
for key,name in [('solar','solar-cover.jpg'),('identity','original-identity-strip.png')]:
    p=out/name;mime='image/jpeg' if p.suffix=='.jpg' else 'image/png';assets[key]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
(ROOT/'src'/'pdf-assets.js').write_text('(function(root){const assets='+json.dumps(assets,separators=(',',':'))+';if(typeof module===\'object\')module.exports=assets;else root.QuoteAssets=assets;})(globalThis);\n')
print(json.dumps({name:Image.open(out/name).size for name in ['solar-cover.jpg','original-identity-strip.png']}))
