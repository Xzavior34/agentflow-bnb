import * as erc8183 from '@bnbagent/sdk/erc8183';

console.log('--- @bnbagent/sdk/erc8183 Exports ---');
console.log(Object.keys(erc8183));

for (const k of Object.keys(erc8183)) {
  console.log(`Export: ${k} (typeof: ${typeof erc8183[k]})`);
  if (typeof erc8183[k] === 'function' && erc8183[k].prototype) {
    console.log(`  Prototype methods:`, Object.getOwnPropertyNames(erc8183[k].prototype));
  }
}
