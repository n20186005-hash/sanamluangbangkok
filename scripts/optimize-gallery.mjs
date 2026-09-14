/**
 * 一次性图片处理脚本（执行后可删除）
 * 1. 原始大图归档到 original-photos/（不参与部署，已被 .gitignore 忽略）
 * 2. 按规范输出 sanam-luang-bangkok-{n}.jpg（≤1600px）与 -640 缩略图
 * 3. 统一转渐进式 JPEG 并去除 EXIF，显著降低体积
 */
import { readdir, stat, mkdir, rename, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const galleryDir = path.resolve('public/gallery');
const archiveDir = path.resolve('original-photos');

await mkdir(galleryDir, { recursive: true });
await mkdir(archiveDir, { recursive: true });

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const originals = (await readdir(galleryDir)).filter((f) => /^sanam-luang-\d+\.jpg$/i.test(f));

// 先把原始大图归档（原文件保留，不销毁）
for (const file of originals) {
  await rename(path.join(galleryDir, file), path.join(archiveDir, file));
}

const sources = (await readdir(archiveDir)).filter((f) => /^sanam-luang-\d+\.jpg$/i.test(f));
const nums = sources.map((f) => Number(f.match(/(\d+)/)[1])).sort((a, b) => a - b);

let before = 0;
let after = 0;

for (const n of nums) {
  const src = path.join(archiveDir, `sanam-luang-${n}.jpg`);
  const full = path.join(galleryDir, `sanam-luang-bangkok-${n}.jpg`);
  const thumb = path.join(galleryDir, `sanam-luang-bangkok-${n}-640.jpg`);

  before += (await stat(src)).size;

  await sharp(src)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
    .toFile(full);

  await sharp(src)
    .rotate()
    .resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 74, mozjpeg: true, progressive: true })
    .toFile(thumb);

  const a = (await stat(full)).size;
  const b = (await stat(thumb)).size;
  after += a + b;
  console.log(`#${n}  ${(a / 1024).toFixed(0)}KB + ${(b / 1024).toFixed(0)}KB`);
}

console.log(`\nprocessed ${nums.length} images`);
console.log(`before: ${(before / 1024 / 1024).toFixed(2)} MB`);
console.log(`after : ${(after / 1024 / 1024).toFixed(2)} MB`);
console.log(`saved : ${(100 - (after / before) * 100).toFixed(1)}%`);

void exists;
