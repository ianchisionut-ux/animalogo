const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'audio-research/manifest.json'),out=path.join(root,'public');
const entries=JSON.parse(fs.readFileSync(source,'utf8')),manifest={};fs.mkdirSync(path.join(out,'sounds'),{recursive:true});
for(const item of entries){const id=item.id==='applause'?'_applause':item.id,extension=path.extname(item.file).toLowerCase(),file='sounds/'+id+extension;fs.copyFileSync(item.file,path.join(out,file));manifest[id]={file,type:'recording',source:item.source,author:item.author,title:item.title,license:item.license,licenseUrl:item.licenseUrl,changes:item.changes,duration:item.duration};}
fs.writeFileSync(path.join(out,'audio-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(out,'audio-credits.txt'),'AnimaLogo — înregistrări audio reale\n\nFișierele audio păstrează licența individuală indicată. Aplicația nu revendică drepturi asupra înregistrărilor.\nFragmentele au fost scurtate și normalizate; nu s-a sintetizat vocea animalelor.\n\n'+Object.entries(manifest).map(([id,e])=>`${id}: ${e.title}\nAutor: ${e.author}\nSursă: ${e.source}\nLicență: ${e.license} (${e.licenseUrl})\nModificări: ${e.changes}\nFișier: ${e.file}\n`).join('\n'));
console.log(Object.keys(manifest).length+' real audio recordings synchronized.');
