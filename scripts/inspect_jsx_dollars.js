import fs from 'fs';

const content = fs.readFileSync('dist/assets/index-v3.js', 'utf8');

// Let's print out all places where dollar or USD appears in JSX rendering
const matches = [];
// Match any children containing $ or USD, or text containing $
const reg = /(?:children:\s*(?:\[[^\]]*\$[^\]]*\]|`[^`]*\$[^`]*`|`[^`]*USD[^`]*`))/g;
let m;
while ((m = reg.exec(content)) !== null) {
  matches.push({ index: m.index, text: m[0] });
}

console.log('JSX children matches with $ or USD:', matches.length);
matches.forEach((item, i) => {
  console.log(`\n#${i+1} [char ${item.index}]:`);
  console.log(item.text);
  const start = Math.max(0, item.index - 100);
  const end = Math.min(content.length, item.index + item.text.length + 100);
  console.log('CTX: ' + content.slice(start, end).replace(/\n/g, ' '));
});
