import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gradeCase,sanitizeProgress,ASSESSMENT_VERSION} from '../src/features/ai/assessment.mjs';
const curriculum=JSON.parse(readFileSync(new URL('../src/features/ai/curriculum.json',import.meta.url)));
const cases=JSON.parse(readFileSync(new URL('../src/features/ai/senior-cases.json',import.meta.url)));
test('AI curriculum has 18 independent, unique, meaningful modules',()=>{
 assert.equal(curriculum.length,18);assert.equal(new Set(curriculum.map(m=>m.id)).size,18);
 for(const m of curriculum){assert.match(m.id,/^AI(0[1-9]|1[0-8])$/);for(const key of ['title','summary','stack','project'])assert.ok(m[key].length>=5);}
});
test('Senior AI: each case has unique id, valid answer and evidence',()=>{
 assert.equal(cases.length,18);assert.equal(new Set(cases.map(c=>c.id)).size,18);
 for(const c of cases){assert.ok(curriculum.some(m=>m.id===c.moduleId));assert.equal(c.options.length,3);assert.ok(c.options.every(x=>x.length>10));assert.ok(c.correctIndex>=0&&c.correctIndex<3);assert.ok(c.evidence.length>=3);}
});
test('All senior cases grade deterministically and require evidence',()=>{
 for(const c of cases){const evidence='Riesgo y mitigación reproducible. Prueba: caso adversarial y criterio: una métrica verificable.';
 assert.equal(gradeCase(c,c.correctIndex,evidence).passed,true);
 assert.equal(gradeCase(c,(c.correctIndex+1)%3,evidence).passed,false);
 assert.equal(gradeCase(c,c.correctIndex,'').passed,false);
 assert.equal(gradeCase(c,-1,evidence).passed,false);}
});
test('Progress rejects invalid IDs and forged score',()=>{
 assert.deepEqual(sanitizeProgress(null),{});assert.deepEqual(sanitizeProgress([]),{});
 const out=sanitizeProgress({'__proto__':{passed:true,score:100,version:ASSESSMENT_VERSION},SAI01:{passed:true,score:100,version:ASSESSMENT_VERSION},SAI02:{passed:true,score:70,version:ASSESSMENT_VERSION}});
 assert.deepEqual(Object.keys(out),['SAI01']);
});
