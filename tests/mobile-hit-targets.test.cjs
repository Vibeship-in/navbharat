const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');
test('expanded mobile inclusion labels retain a full 44px touch target',()=>{const css=fs.readFileSync('src/equipment.css','utf8').split('@media(max-width:700px)').at(-1);assert.match(css,/\.equipment-table \.item-include\s*\{[^}]*width:44px;[^}]*flex-basis:44px;[^}]*min-height:44px/);});
