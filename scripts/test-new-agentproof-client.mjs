import { fetchAgentProofPassport, getAgentProofDirectUrl } from '../src/services/agentproof/client.ts';

async function main() {
  console.log('Testing client for 49637...');
  console.log('Direct URL:', getAgentProofDirectUrl('49637'));
  const res1 = await fetchAgentProofPassport(56, '49637');
  console.log('Res 49637:', res1);

  console.log('\nTesting client for 316380...');
  console.log('Direct URL:', getAgentProofDirectUrl('316380'));
  const res2 = await fetchAgentProofPassport(56, '316380');
  console.log('Res 316380:', res2);

  console.log('\nTesting client for 338367...');
  const res3 = await fetchAgentProofPassport(56, '338367');
  console.log('Res 338367:', res3);
}

main();
