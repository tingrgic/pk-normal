import {test,expect} from '@playwright/test';
import {statistics,canCheckout,parseSession,type Session,type Action} from '../src/counter/engine';
const dart=(number:number,multiplier:1|2|3=1):Action=>({type:'dart',hit:{number,multiplier}});
const next:Action={type:'next'};
const base:Session={version:1,config:{mode:'x01',start:301,entry:'open',out:'double',rounds:8,players:[{id:'a',name:'A',tag:''}]},actions:[]};
test('checkout attempts follow the remainder before each dart; 112 → 52 → 50 → 37 is 0/1',()=>{
 const s={...base,actions:[dart(20,3),dart(20,3),dart(20,3),next,dart(9),dart(0),dart(0),next,dart(20,3),dart(2),dart(13)]};
 const a=statistics(s)[0];expect(a.finishes[50]).toEqual({hits:0,attempts:1});expect(a.checkoutAttempts).toBe(1);expect(a.checkoutHits).toBe(0);expect(a.visits.at(-1)?.remaining).toBe(37);
 expect(statistics({...s,actions:s.actions.slice(0,-1)})[0].checkoutAttempts).toBe(0);
 expect(statistics(parseSession(JSON.stringify(s))!)).toEqual(statistics(s));
});
test('bust restores scoring average but counts actual thrown darts and missed finishes',()=>{
 const s={...base,actions:[dart(20,3),dart(20,3),dart(20,3),next,dart(20,3),dart(19,3),dart(4)]};
 const a=statistics(s)[0];expect(a.points).toBe(180);expect(a.darts).toBe(6);expect(a.average).toBe(90);expect(a.firstNineAverage).toBe(90);expect(a.finishes[4]).toEqual({hits:0,attempts:1});expect(a.visits[1].bust).toBe(true);
});
test('first nine, winning visit checkout and per-player columns are independently reconstructed',()=>{
 const s={...base,actions:[dart(20,3),dart(20,3),dart(20,3),next,dart(20,3),dart(19),dart(21)]};
 // Invalid events are ignored by the reducer. Finish 42 with 2 + D20.
 s.actions=[...s.actions.slice(0,6),dart(2),next,dart(20,2)];
 const a=statistics(s)[0];expect(a.points).toBe(301);expect(a.darts).toBe(7);expect(a.highestCheckout).toBe(40);expect(a.finishes[40]).toEqual({hits:1,attempts:1});
 const two={...base,config:{...base.config,players:[...base.config.players,{id:'b',name:'B',tag:''}]},actions:[dart(20),dart(1),dart(0),next,dart(5)]};
 expect(statistics(two).map(p=>[p.darts,p.points])).toEqual([[3,21],[1,5]]);
});
test('finishable scores honor normal, double, master and bull; double-in misses score zero',()=>{
 expect(canCheckout(50,'double')).toBe(true);expect(canCheckout(52,'double')).toBe(false);expect(canCheckout(37,'double')).toBe(false);expect(canCheckout(60,'master')).toBe(true);expect(canCheckout(20,'open')).toBe(true);expect(canCheckout(23,'open')).toBe(false);
 const a=statistics({...base,config:{...base.config,entry:'double'},actions:[dart(20,3),dart(20,2),dart(20,3)]})[0];expect(a.points).toBe(100);expect(a.darts).toBe(3);
 const s={...base,config:{...base.config,start:501},actions:[...Array.from({length:3},()=>[dart(20),dart(20),dart(20),next]).flat(),dart(20,3)]};
 expect(statistics(s)[0].firstNineAverage).toBe(60);expect(statistics(s)[0].average).toBe(72);
});
