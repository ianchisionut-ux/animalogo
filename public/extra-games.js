/* Additional visual and auditory games. All rounds retain their selected mode. */
const EXTRA_GAMES=[['memory','🐾','Perechi','#d9f4e9'],['shadow','◐','Umbre','#e5e0fb'],['sequence','♫','Șir de sunete','#d5f1fc'],['groups','🧺','Categorii','#ffe6bd']];
const ANIMAL_GROUPS={d:['🚜','Domestice'],s:['🌳','Sălbatice'],i:['🐝','Insecte']};
let adventurePage=0,sequenceEpoch=0;
function changeAdventures(page){adventurePage=page;goHome();}
function renderExtraGame(){
  if(session.mode==='memory')renderMemory();
  else if(session.mode==='shadow')renderShadow();
  else if(session.mode==='sequence')renderSequence();
  else renderGroups();
}
function completeExtra(el){session.correct++;if(session.roundAttempts===0)session.first++;session.done=true;correctFeedback(el,true);queueNext();}
function renderMemory(){
  const animals=[session.target,...sample(pool().filter(a=>a.id!==session.target.id),Math.min(4,Number(settings.level))-1)];
  session.deck=sample(animals.flatMap(a=>[a,a]));session.flipped=[];session.found=[];
  app.innerHTML=chrome('Perechi')+`<section class="memory-grid" style="--pairs:${animals.length}">${session.deck.map((a,i)=>`<button class="memory-card" data-memory="${i}" onclick="flipMemory(${i},this)" aria-label="Carte ${i+1}" aria-pressed="false"><span class="memory-back" aria-hidden="true">🐾</span><span class="memory-face mini-art" style="${artStyle(a)}" aria-hidden="true"></span><span class="pair-check" aria-hidden="true">✓</span></button>`).join('')}</section>`+footer();
}
function flipMemory(index,el){
  if(!session||session.mode!=='memory'||session.done||session.blocked||session.found.includes(index)||session.flipped.includes(index))return;
  if(session.flipped.length===2)closeMemoryPair();
  const a=session.deck[index];session.flipped.push(index);el.classList.add('revealed');el.setAttribute('aria-label',a.name);el.setAttribute('aria-pressed','true');
  if(session.flipped.length<2)return;
  session.attempts++;const [first,second]=session.flipped;
  if(session.deck[first].id===session.deck[second].id){session.found.push(first,second);for(const i of session.flipped){const card=$(`[data-memory="${i}"]`);card.classList.add('matched');card.disabled=true;}session.flipped=[];if(session.found.length===session.deck.length)completeExtra(el);else correctFeedback(el,false);}
  else{session.roundAttempts++;wrongFeedback(el);session.blocked=true;clearTimeout(retryTimer);const current=session;retryTimer=setTimeout(()=>{if(session!==current)return;closeMemoryPair();session.blocked=false;},900);}
}
function closeMemoryPair(){for(const i of session.flipped){const card=$(`[data-memory="${i}"]`);card?.classList.remove('revealed');card?.setAttribute('aria-label',`Carte ${i+1}`);card?.setAttribute('aria-pressed','false');}session.flipped=[];}
function visualOptions(){return sample([session.target,...sample(pool().filter(a=>a.id!==session.target.id&&a.emoji!==session.target.emoji),Number(settings.level)-1)]);}
function renderShadow(){
  session.options=visualOptions();
  app.innerHTML=chrome('Umbre')+`<div class="shadow-clue" role="img" aria-label="Siluetă de animal"><img src="shadows/${session.target.id}.png" alt="" aria-hidden="true"></div><section class="quiz-list extra-options" data-count="${session.options.length}" style="--count:${session.options.length}">${session.options.map(a=>animalCard(a,`answerVisual('${a.id}',this)`,false)).join('')}</section>`+footer();
}
function answerVisual(id,el){if(!session||session.done||session.blocked)return;session.attempts++;if(id===session.target.id){el.classList.add('correct');completeExtra(el);}else{session.roundAttempts++;wrongFeedback(el);}}
function renderGroups(){
  const a=session.target;session.groupOptions=sample(Object.keys(ANIMAL_GROUPS));
  app.innerHTML=chrome('Categorii')+`<div class="group-clue detail-art" style="${artStyle(a)}" role="img" aria-label="${a.name}"></div><section class="group-options">${session.groupOptions.map(key=>`<button class="group-choice" onclick="answerGroup('${key}',this)" aria-label="${ANIMAL_GROUPS[key][1]}"><span aria-hidden="true">${ANIMAL_GROUPS[key][0]}</span><strong>${ANIMAL_GROUPS[key][1]}</strong></button>`).join('')}</section>`+footer();
}
function answerGroup(key,el){if(!session||session.done||session.blocked)return;session.attempts++;if(key===session.target.group){el.classList.add('correct');completeExtra(el);}else{session.roundAttempts++;wrongFeedback(el);}}
function renderSequence(){
  const animals=[session.target,...sample(pool().filter(a=>a.id!==session.target.id),Number(settings.level)-1)];
  session.sequence=sample(animals,Number(settings.level)===2?2:3);session.options=sample(animals);session.sequenceStep=0;session.heardSequence=false;session.sequencePlaying=false;
  app.innerHTML=chrome('Șir de sunete')+`<section class="sequence-controls"><button class="listen" id="sequence-play" onclick="playSequence(this)" aria-label="Redă șirul de sunete">♫ ▶</button><div class="sequence-steps" aria-label="Progres șir">${session.sequence.map((a,i)=>`<span data-step="${i}" aria-label="Sunetul ${i+1}">●</span>`).join('')}</div></section><section class="quiz-list extra-options" data-count="${animals.length}" style="--count:${animals.length}">${session.options.map(a=>animalCard(a,`answerSequence('${a.id}',this)`,false)).join('')}</section>`+footer();setSequenceChoices(false);
}
function setSequenceChoices(enabled){document.querySelectorAll('.extra-options .animal').forEach(b=>b.disabled=!enabled);}
function cancelSequence(){sequenceEpoch++;if(session?.sequencePlaying){session.sequencePlaying=false;const b=$('#sequence-play');if(b)b.disabled=false;document.querySelectorAll('[data-step]').forEach(e=>e.classList.remove('hearing'));setSequenceChoices(session.heardSequence);}}
async function playSequence(button){
  if(!session||session.mode!=='sequence'||session.done||session.sequencePlaying||session.blocked)return;
  if(settings.muted){toast('Activează sunetul din butonul ♫.');return;}
  stop();const current=session,epoch=sequenceEpoch;session.sequencePlaying=true;session.heardSequence=false;session.sequenceStep=0;button.disabled=true;setSequenceChoices(false);document.querySelectorAll('[data-step]').forEach(e=>{e.textContent='●';e.className='';});
  try{for(let i=0;i<current.sequence.length;i++){
    if(session!==current||sequenceEpoch!==epoch)return;
    const dot=$(`[data-step="${i}"]`);dot.classList.add('hearing');
    const played=await AudioLibrary.play(current.sequence[i].id);
    if(session!==current||sequenceEpoch!==epoch){AudioLibrary.stop();return;}
    if(!played)return;
    const player=AudioLibrary.player;
    await new Promise(resolve=>{let timer;const finish=()=>{clearTimeout(timer);player?.removeEventListener('ended',finish);player?.removeEventListener('error',finish);resolve();};player?.addEventListener('ended',finish,{once:true});player?.addEventListener('error',finish,{once:true});timer=setTimeout(finish,2500);});
    if(session!==current||sequenceEpoch!==epoch)return;
    AudioLibrary.stop();dot.classList.remove('hearing');await new Promise(r=>setTimeout(r,240));
  }if(session===current&&sequenceEpoch===epoch){current.heardSequence=true;setSequenceChoices(true);}}
  finally{if(session===current&&sequenceEpoch===epoch){current.sequencePlaying=false;button.disabled=false;}}
}
function answerSequence(id,el){
  if(!session||session.mode!=='sequence'||session.done||session.blocked||session.sequencePlaying||!session.heardSequence)return;
  session.attempts++;
  if(id===session.sequence[session.sequenceStep].id){$(`[data-step="${session.sequenceStep}"]`).textContent='✓';session.sequenceStep++;if(session.sequenceStep===session.sequence.length)completeExtra(el);else correctFeedback(el,false);}
  else{session.roundAttempts++;session.sequenceStep=0;document.querySelectorAll('[data-step]').forEach(e=>e.textContent='●');wrongFeedback(el);}
}
