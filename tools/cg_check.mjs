// Both editions must expose the same curated CG set, with no orphan production slots.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const expected = new Set([
  'cg_chizutsutsu_kobore_shashin', 'cg_omoide_chikeizu_kansei',
  'cg_yama_ue_hajimete_chizu', 'cg_hareyaka_na_emi',
  'cg_sotsugyou_sakurafubuki', 'cg_end_true', 'cg_end_bonus',
]);
const same = (ids, label) => assert.deepEqual(new Set(ids), expected, label);
const db = JSON.parse(read('data/assets.json'));
same(db.assets.filter(a => a.cat === 'cg').map(a => a.id), 'A manifest');
assert.equal(db.assigned, db.assets.length);
const aScript = fs.readdirSync(path.join(root, 'data/script')).filter(f => f.endsWith('.txt')).map(f => read('data/script/' + f)).join('\n');
same([...aScript.matchAll(/^@cg (cg_\w+)/gm)].map(m => m[1]), 'A script');
const ctx = vm.createContext({window: {SCENES: {}, TIPS: {}, CHARS: {}}});
for (const file of ['assets_manifest.js', 'characters.js', ...fs.readdirSync(path.join(root, 'game/js')).filter(f => /^script_.*\.js$/.test(f)).sort()]) {
  vm.runInContext(read('game/js/' + file), ctx);
}
const man = ctx.window.ASSET_MANIFEST;
same([...Object.keys(man.cg), ...Object.keys(man.ed_cg)], 'B manifest');
const scenes = Object.values(ctx.window.SCENES);
same(scenes.flatMap(s => s.data.filter(c => c[0] === 'cg').map(c => c[1])), 'B script');
for (const [id, scene] of Object.entries(ctx.window.SCENES)) {
  if (!id.startsWith('end_') || !scene.data.some(c => c[0] === 'endlogo')) continue;
  assert(scene.data.some(c => c[0] === 'bg' || c[0] === 'cg'), `${id}: ending needs a setting`);
}
same([...read('docs/CG_PROMPTS.md').matchAll(/^### `(cg_\w+)`/gm)].map(m => m[1]), 'Production prompts');
console.log('✓ CG7枚: 両版の台帳・本編・生成指示が一致、END背景あり');
