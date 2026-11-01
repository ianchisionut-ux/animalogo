// Downloads the fixed animal-name pronunciations into this project's web assets.
// Does not install software, voices, packages or system components.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../public'),scope={};vm.createContext(scope);
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8')+';this.animals=ANIMALS;',scope);
async function main(){
 fs.mkdirSync(path.join(root,'names'),{recursive:true});const manifest={};
 for(const animal of scope.animals){
  const file='names/'+animal.id+'.mp3',url=new URL('https://translate.google.com/translate_tts');
  url.search=new URLSearchParams({ie:'UTF-8',client:'tw-ob',tl:'ro',q:animal.name}).toString();
  if(!fs.existsSync(path.join(root,file))){
   const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
   if(!response.ok||!response.headers.get('content-type')?.includes('audio'))throw Error(`Name audio ${animal.id}: ${response.status} ${response.headers.get('content-type')}`);
   const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length<500)throw Error('Empty speech: '+animal.id);
   fs.writeFileSync(path.join(root,file),bytes);console.log('Romanian name saved:',animal.name);
   await new Promise(resolve=>setTimeout(resolve,450));
  }
  manifest[animal.id]={file,text:animal.name,language:'ro',provider:'Google Translate speech',source:url.href};
 }
 fs.writeFileSync(path.join(root,'name-audio-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('36 Romanian names bundled with the website. No system changes.');
}
main().catch(e=>{console.error(e);process.exit(1);});
