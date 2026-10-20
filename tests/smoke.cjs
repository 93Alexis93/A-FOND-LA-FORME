const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
  await page.locator('#monthTitle').waitFor();
  const first=await page.locator('#monthTitle').innerText();
  await page.locator('#monthNext').click();
  const next=await page.locator('#monthTitle').innerText();
  if(first===next)throw Error('Mois suivant ne répond pas');
  await page.locator('#monthPrev').click();
  if((await page.locator('#monthTitle').innerText())!==first)throw Error('Mois précédent ne revient pas');
  await page.locator('#calendar .calcell button').first().click();
  if(!(await page.locator('#calendar .calcell.done').count()))throw Error('Date non cochée');
  await page.locator('#quickDone').click();
  if(!(await page.locator('#quickDone').innerText()).includes('enregistrée'))throw Error('Activité rapide non enregistrée');
  await page.reload();
  if(!(await page.locator('#quickDone').innerText()).includes('enregistrée'))throw Error('Sauvegarde locale perdue');
  await page.locator('#quickRest').click();
  if(!(await page.locator('#quickRest').innerText()).includes('notée'))throw Error('Repos rapide non enregistré');
  await page.locator('#expressPlay').click();
  await page.waitForTimeout(1200);
  await page.locator('#expressPause').click();
  if((await page.locator('#expressClock').innerText())==='10:00')throw Error('Chrono express immobile');
  await page.locator('#expressReset').click();
  if((await page.locator('#expressClock').innerText())!=='10:00')throw Error('Reset chrono express incorrect');
  await page.locator('#coachPlay').click();
  await page.waitForTimeout(1200);
  await page.locator('#coachPause').click();
  if((await page.locator('#coachClock').innerText())==='20:00')throw Error('Chrono 20 min immobile');
  if(errors.length)throw Error('Erreurs navigateur: '+errors.join(' | '));
  console.log('OK : calendrier, boutons, activité, repos, persistance, chronos');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
