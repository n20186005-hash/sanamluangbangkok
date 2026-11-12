// Run only when refreshing the curated Wikimedia Commons photographs below.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const selections = [
  ['grand-palace','A roof of a building at the Grand Palace, Bangkok, sunrise, 2017.jpg'],
  ['wat-phra-kaew','Temple of the Emerald Buddha.jpg'],
  ['bangkok-national-museum','Bangkok National Museum.jpg'],
  ['bangkok-city-pillar','Bangkok city pillar shrine 20240917.jpg'],
  ['wat-pho','Wat Pho, Bangkok, Tailandia, 2013-08-22, DD 02.jpg'],
  ['democracy-monument','2016 Bangkok, Dystrykt Phra Nakhon, Pomnik Demokracji (03).jpg'],
  ['sanam-chai-mrt','MRT Blue Line, Sanam Chai Station.jpg'],
  ['tha-chang-pier','Tha Chang Pier, Chao Phraya River, Bangkok (6906961094).jpg'],
  ['thammasat-university','Thammasat University Tha Phra Chan Campus 01.JPG'],
  ['tha-maharaj','Siriraj Hospital from Tha Maharaj.jpg'],
  ['riverfront-dining','Lunch at Rongros, Bangkok (Jan 2021) - img 02.jpg'],
];
const directory = join(process.cwd(),'public','nearby');
mkdirSync(directory,{recursive:true});
for (const [slug,name] of selections) {
  if(process.argv[2] && process.argv[2] !== slug) continue;
  const query = execFileSync('curl',['-fsSL','--max-time','20','-G','https://commons.wikimedia.org/w/api.php',
    '--data-urlencode','action=query','--data-urlencode',`titles=File:${name}`,
    '--data-urlencode','prop=imageinfo','--data-urlencode','iiprop=url','--data-urlencode','iiurlwidth=900',
    '--data-urlencode','format=json'],{encoding:'utf8'});
  const page = Object.values(JSON.parse(query).query?.pages ?? {})[0];
  const url = page?.imageinfo?.[0]?.thumburl;
  if (!url || page.missing !== undefined) throw new Error(`No matching Commons file: ${name}`);
  const path=join(directory,`${slug}.jpg`);
  execFileSync('curl',['-fLsS','--retry','2','--max-time','45',url,'-o',path]);
  const size=statSync(path).size;
  if(size<10000)throw new Error(`Downloaded image too small: ${slug} (${size})`);
  process.stdout.write(`${slug}: ${size} bytes, ${name}\n`);
}
