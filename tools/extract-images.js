#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const srcDir = path.resolve(process.cwd(), 'src', 'assets');
const outDir = path.resolve(process.cwd(), 'extracted-images');
const exts = new Set(['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.bmp', '.avif']);

async function ensureDir(dir){
  await fs.mkdir(dir, { recursive: true });
}

async function copyRecursive(src, destRoot){
  const entries = await fs.readdir(src, { withFileTypes: true });
  for(const ent of entries){
    const srcPath = path.join(src, ent.name);
    if(ent.isDirectory()){
      await copyRecursive(srcPath, destRoot);
      continue;
    }
    const ext = path.extname(ent.name).toLowerCase();
    if(!exts.has(ext)) continue;
    // preserve relative path under assets
    const rel = path.relative(path.resolve(process.cwd(), 'src', 'assets'), srcPath);
    const destPath = path.join(destRoot, rel);
    await ensureDir(path.dirname(destPath));
    await fs.copyFile(srcPath, destPath);
    console.log('Copied', rel);
  }
}

async function run(){
  try{
    await ensureDir(outDir);
    const stat = await fs.stat(srcDir).catch(()=>null);
    if(!stat || !stat.isDirectory()){
      console.error('source assets directory not found:', srcDir);
      process.exit(1);
    }
    await copyRecursive(srcDir, outDir);
    console.log('\nAll images copied to', outDir);
  }catch(err){
    console.error(err);
    process.exit(2);
  }
}

run();
