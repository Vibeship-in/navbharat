"""Render the branded share artwork. Requires Pillow; fonts are local render inputs."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parents[1]
FONT = Path('/System/Library/Fonts/Supplemental')
S = 2
GREEN, CREAM, GOLD, MUTED = '#163d32', '#f6f5ef', '#ad7b37', '#66756f'
im = Image.new('RGB', (1200*S, 630*S), CREAM)
d = ImageDraw.Draw(im)
def box(r, fill, radius=0):
    r=tuple(int(v*S) for v in r)
    if radius: d.rounded_rectangle(r, int(radius*S), fill=fill)
    else: d.rectangle(r, fill=fill)
def line(points, fill, width=1): d.line([(int(x*S),int(y*S)) for x,y in points],fill=fill,width=int(width*S))
def text(x,y,value,size=24,color=GREEN,font='Arial.ttf'):
    f=ImageFont.truetype(str(FONT/font),int(size*S))
    assert d.textbbox((x*S,y*S),value,font=f)[2] <= im.width-45*S, value
    d.text((x*S,y*S),value,font=f,fill=color)
def mark(x,y,k=1):
    def pt(a,b): return (int((x+a*k)*S),int((y+b*k)*S))
    d.ellipse([pt(27,5),pt(37,15)],fill=GOLD)
    d.polygon([pt(4,21),pt(27,15),pt(39,30),pt(16,36)],fill=GREEN)
    for a,b in [((12,19),(24,34)),((20,17),(32,32)),((9,27),(32,21))]:d.line([pt(*a),pt(*b)],fill=CREAM,width=max(1,int(1.2*k*S)))
    for a,b in [((15,37),(15,41)),((33,33),(33,41)),((10,41),(38,41))]:d.line([pt(*a),pt(*b)],fill=GREEN,width=int(2*k*S))
box((0,0,1200,9),GREEN)
mark(67,65,1.5)
text(147,70,'Nav Bharat',37,font='Georgia Bold.ttf')
text(149,119,'E N T E R P R I S E S',13,color=MUTED,font='Arial Bold.ttf')
text(72,230,'Solar quotations.',57,font='Georgia.ttf')
text(74,323,'Prepared with clarity.',30)
text(74,379,'Customer details. Equipment. Pricing.',21,color=MUTED)
text(74,414,'Review your proposal and share the PDF.',21,color=MUTED)
line([(74,533),(132,533)],GOLD,3)
text(149,520,'QUOTATION WORKSPACE',14,color=MUTED,font='Arial Bold.ttf')
box((741,0,1200,630),GREEN)
# Architectural linework behind a clean proposal sheet, not a customer record.
for x in range(770,1250,55):line([(x,425),(x-165,630)],'#285044',1)
for y in range(440,650,43):line([(741,y),(1200,y)],'#285044',1)
box((813,95,1119,542),'#0e2c24',8)
box((795,78,1101,525),CREAM,5)
mark(818,96,0.85)
text(861,110,'Nav Bharat',19,font='Georgia Bold.ttf')
line([(823,164),(1073,164)],'#dce3db',1)
text(823,187,'SOLAR PROPOSAL',13,color=MUTED,font='Arial Bold.ttf')
text(823,220,'A clear path',29,font='Georgia.ttf')
text(823,255,'to rooftop solar.',29,font='Georgia.ttf')
box((823,315,1073,344),'#e5ebe2')
for y in [367,393,419]:
    line([(823,y),(1073,y)],'#dce3db',1)
    box((825,y-13,914,y-9),'#b5c2b7')
    box((1019,y-13,1071,y-9),'#b5c2b7')
box((823,454,1073,490),GREEN,4)
text(877,463,'REVIEW & SHARE',12,color=CREAM,font='Arial Bold.ttf')
im.resize((1200,630),Image.Resampling.LANCZOS).save(ROOT/'assets/og-image.png',optimize=True)
print('Rendered assets/og-image.png (1200 x 630).')
