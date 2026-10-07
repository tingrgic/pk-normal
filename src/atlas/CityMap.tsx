import { useLanguage } from "../i18n/Language";
import { useEffect, useRef, useState } from 'react';
import { Map, Marker, AttributionControl, setWorkerUrl, setWorkerCount } from 'maplibre-gl';
import type { StyleSpecification } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { venues } from '../data/atlas';
setWorkerUrl(workerUrl);
setWorkerCount(2);

type Props = { selected: string | null; visibleVenues: string[]; onSelect: (id: string) => void };
export default function CityMap({ selected, visibleVenues, onSelect }: Props) {
  const { t, language } = useLanguage();

 const host=useRef<HTMLDivElement>(null), map=useRef<Map|null>(null);
 const pins=useRef<{id:string; marker:Marker; button:HTMLButtonElement}[]>([]);
 const latest=useRef({selected,visibleVenues,onSelect}); latest.current={selected,visibleVenues,onSelect};
 const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
 const [threeD,setThreeD]=useState(true), [attempt,setAttempt]=useState(0);
 const [overview,setOverview]=useState(false);
 const overviewRef=useRef(false);
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function focusVenue(id: string | null) {
   const venue=venues.find(v=>v.id===id); if(!venue || !map.current)return;
   setOverview(false); overviewRef.current=false;
   map.current.flyTo({ center:venue.coordinates, padding:0, zoom:15.7, pitch:threeD?45:0, bearing:threeD?-15:0, duration:reduced()?0:1400, essential:false });
 }
 function showCity() {
   setOverview(true); overviewRef.current=true; setThreeD(false);
   map.current?.fitBounds([[15.887,45.781],[16.114,45.841]], { padding: {top:105,bottom:145,left:45,right:45}, pitch:0,bearing:0,duration:reduced()?0:1200,maxZoom:12.2 });
 }
 useEffect(()=>{
   let disposed=false, timeout:ReturnType<typeof setTimeout>;
   const abort=new AbortController(); setStatus('loading');
   async function init() {
    try {
     const response=await fetch('https://tiles.openfreemap.org/styles/positron',{signal:abort.signal});
     if(!response.ok)throw new Error('Map style unavailable');
     const style=await response.json() as StyleSpecification;
     if(disposed || !host.current)return;
     // Warm paper cartography: streets stay distinct from softly lit buildings.
     for(const layer of style.layers) {
       if(layer.type==='background') layer.paint={'background-color':'#eeece4'};
       if(layer.type==='fill') {
         const color:Record<string,string>={water:'#a9ced6',park:'#cfdcc2',landcover_wood:'#c5d5b9',landuse_residential:'#e7e3d9',building:'#d6c3aa'};
         if(color[layer.id])layer.paint={...layer.paint,'fill-color':color[layer.id]};
         if(layer.id==='building')layer.paint={...layer.paint,'fill-outline-color':'#baa88e'};
       }
       if(layer.type==='line' && layer.id==='waterway')layer.paint={...layer.paint,'line-color':'#8cbac6'};
       if(layer.type==='line' && layer.id==='highway_minor')layer.paint={...layer.paint,'line-color':'#fffdf7'};
       if(layer.type==='symbol' && layer.layout?.['text-field']) {
         layer.paint={...layer.paint,'text-color':'#45524f','text-halo-color':'#faf8f1','text-halo-width':1.5};
       }
     }
     const venue=venues.find(v=>v.id===latest.current.selected)||venues[0];
     const instance=new Map({container:host.current,style,center:venue.coordinates,zoom:14.9,pitch:threeD?45:0,bearing:threeD?-15:0,attributionControl:false,cooperativeGestures:true,locale:{'AttributionControl.ToggleAttribution':t('Prikaži izvore karte'),'Map.Title':t('Karta'),'CooperativeGesturesHandler.WindowsHelpText':t('Za povećanje karte koristi Ctrl i kotačić'),'CooperativeGesturesHandler.MacHelpText':t('Za povećanje karte koristi ⌘ i kotačić'),'CooperativeGesturesHandler.MobileHelpText':t('Pomakni kartu s dva prsta')},maxPitch:65,minZoom:9,maxZoom:18,maxBounds:[[15.70,45.64],[16.30,45.98]],pixelRatio:Math.min(devicePixelRatio,1.5),renderWorldCopies:false});
     map.current=instance;
     instance.addControl(new AttributionControl({compact:true}),'bottom-right');
     instance.getCanvas().setAttribute('aria-label',t("Karta Zagreba. Strelice pomiču kartu, plus i minus mijenjaju povećanje."));
     instance.on('load',()=>{
       if(disposed)return;
       const label=instance.getStyle().layers.find(l=>l.type==='symbol')?.id;
       instance.addLayer({id:'normal-buildings',type:'fill-extrusion',source:'openmaptiles','source-layer':'building',minzoom:13,paint:{'fill-extrusion-color':'#dfc5a5','fill-extrusion-vertical-gradient':false,'fill-extrusion-height':['coalesce',['get','render_height'],8],'fill-extrusion-base':['coalesce',['get','render_min_height'],0],'fill-extrusion-opacity':0.95}},label);
       instance.setLight({anchor:'viewport',color:'#ffffff',intensity:0.3,position:[1.15,210,50]});
       clearTimeout(timeout);setStatus('ready');
     });
     instance.on('error',()=>{ /* Timeout supplies a useful fallback if map data fails. */ });
     instance.on('webglcontextlost',()=>{ if(!disposed)setStatus('error'); });
     for(const v of venues) {
       const button=document.createElement('button');button.type='button';button.className='atlas-pin';
       button.setAttribute('aria-label',t(v.name)+' · '+v.address);button.title=t(v.name);
       const dart=document.createElement('img');dart.src=import.meta.env.BASE_URL+'dart-marker.svg';dart.alt='';dart.width=64;dart.height=80;button.append(dart);
       const num=document.createElement('span');num.textContent=v.number;button.append(num);
       const label=document.createElement('small');label.textContent=t(v.name);button.append(label);
       button.addEventListener('click',()=>latest.current.onSelect(v.id));
       button.hidden=!latest.current.visibleVenues.includes(v.id);
       button.classList.toggle('selected',v.id===latest.current.selected);
       button.setAttribute('aria-pressed',String(v.id===latest.current.selected));
       const marker=new Marker({element:button,anchor:'bottom',offset:[0,4]}).setLngLat(v.coordinates).addTo(instance);
       pins.current.push({id:v.id,marker,button});
     }
    } catch { if(!disposed)setStatus('error'); }
   }
   timeout=setTimeout(()=>{if(!disposed){setStatus('error');abort.abort();}},18000);
   void init();
   const resize=new ResizeObserver(()=>{map.current?.resize();if(overviewRef.current)map.current?.fitBounds([[15.887,45.781],[16.114,45.841]],{padding:{top:105,bottom:145,left:45,right:45},duration:0,maxZoom:12.2});});if(host.current)resize.observe(host.current);
   return ()=>{disposed=true;abort.abort();clearTimeout(timeout);resize.disconnect();pins.current.forEach(p=>p.marker.remove());pins.current=[];map.current?.remove();map.current=null;};
 },[attempt, language]);
 useEffect(()=>{
   for(const pin of pins.current) {
     pin.button.hidden=!visibleVenues.includes(pin.id);
     pin.button.classList.toggle('selected',pin.id===selected);
     pin.button.setAttribute('aria-pressed',String(pin.id===selected));
   }
   if(status==='ready') { if(selected)focusVenue(selected); else showCity(); }
 },[selected,status,visibleVenues.join(',')]);
 return <div className="city-map-frame" data-map-status={status}>
   <div ref={host} className="city-map-canvas" />
   <div className="atlas-map-caption"><span className="mono">ZAGREB / SESVETE</span><strong>{overview?t("GRAD JE TEREN."):t("NA MJESTU IGRE.")}</strong></div>
   {status==='ready' && <><label className="atlas-venue-picker"><span>{t('Odaberi igralište')}</span><select aria-label={t('Odaberi igralište')} value={selected||''} onChange={e=>{onSelect(e.target.value);focusVenue(e.target.value);}}><option value="" disabled>{t('Odaberi igralište')}</option>{venues.filter(v=>visibleVenues.includes(v.id)).map(v=><option value={v.id} key={v.id}>{v.number} / {t(v.name)}</option>)}</select></label><div className="atlas-map-controls" aria-label={t("Kontrole karte")}>
     <button onClick={showCity}>{t("Cijeli grad")}</button><button disabled={!selected} onClick={()=>focusVenue(selected)}>{t("Lokacija")}</button>
     <button aria-pressed={threeD} onClick={()=>{const value=!threeD;setThreeD(value);map.current?.easeTo({pitch:value?45:0,bearing:value?-15:0,duration:reduced()?0:650});}}>{threeD?t("2D prikaz"):t("3D prikaz")}</button>
     <button aria-label={t('Sjever gore')} onClick={()=>map.current?.easeTo({bearing:0,duration:reduced()?0:500})}><span aria-hidden="true">↑ N</span></button>
     <button aria-label={t("Približi kartu")} onClick={()=>map.current?.zoomIn({duration:reduced()?0:250})}>+</button><button aria-label={t("Udalji kartu")} onClick={()=>map.current?.zoomOut({duration:reduced()?0:250})}>−</button>
   </div></>}
   {status==='loading' && <div className="atlas-map-message" role="status"><span className="atlas-calibration" aria-hidden="true"/><p>{t("Postavljamo Zagreb na kartu.")}</p><small>{t("Raspored i detalji dostupni su odmah.")}</small></div>}
   {status==='error' && <div className="atlas-map-message" role="status"><p>{t("Karta trenutačno nije dostupna.")}</p><small>{t("Utakmice, adrese i upute za dolazak i dalje su dostupne u rasporedu.")}</small><button onClick={()=>setAttempt(n=>n+1)}>{t("Pokušaj ponovno")}</button></div>}
   <p className="atlas-map-help">{t("Dva prsta za pomicanje na mobitelu. 3D zgrade vidljive su izbliza.")}</p>
 </div>;
}
