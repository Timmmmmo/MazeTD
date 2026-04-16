// MazeTD V22.0 - Constants (Game Data)
// Extracted from V20.0 for PixiJS migration

export const CS = 40;
export const COLS = 8;
export const ROWS = 12;
export const ENTRY = { x: 1, y: 0 };
export const EXIT = { x: COLS - 2, y: ROWS - 1 };

export const T = {
  archer: { c: '#4CAF50', d: 20, r: 4, s: 1200, $: 60, dps: 20 },
  ice: { c: '#03A9F4', d: 12, r: 3.5, s: 1400, $: 65, dps: 10, slow: .4, slowDur: 180 },
  cannon: { c: '#F44336', d: 40, r: 2.8, s: 1600, $: 100, dps: 25, a: 1.5 },
  poison: { c: '#8BC34A', d: 8, r: 3, s: 900, $: 80, dps: 10, dot: 18, dotStacks: 5, dotDur: 220 },
  thunder: { c: '#9C27B0', d: 28, r: 4.2, s: 1400, $: 110, dps: 22, chain: 3 },
  wall: { c: '#78909C', d: 0, r: 0, s: 0, $: 20, hp: 500, maxHp: 500, isWall: true }
};

export const N = {
  archer: '弓箭塔',
  ice: '冰冻塔',
  cannon: '炮塔',
  poison: '毒塔',
  thunder: '雷电塔',
  wall: '墙壁'
};

export const ENEMY_TYPES = {
  normal: { hp: 55, color: '#8BC34A', size: .4, gold: 8, speed: .35 },
  fast: { hp: 35, color: '#42A5F5', size: .32, gold: 10, speed: .55 },
  tank: { hp: 180, color: '#78909C', size: .52, gold: 22, speed: .18 },
  destroyer: { hp: 220, color: '#D32F2F', size: .48, gold: 28, speed: .15, isDestroyer: true, atkDmg: 80, atkSpeed: 1500 },
  scout: { hp: 65, color: '#FFD700', size: .36, gold: 14, speed: .35, isScout: true },
  shifter: { hp: 120, color: '#9C27B0', size: .42, gold: 20, speed: .28, isShifter: true }
};

export const CHAPTERS = {
  tutorial: { name: '入门篇', color: '#4CAF50' },
  basics: { name: '基础篇', color: '#2196F3' },
  advanced: { name: '进阶篇', color: '#9C27B0' },
  challenge: { name: '挑战篇', color: '#FF5722' },
  elite: { name: '精英篇', color: '#FFD700' }
};

export const LEVELS = [
  { id: '1-1', name: '初阵', chapter: 'tutorial', waves: 3, startGold: 650, goldBonus: 40, unlock: ['wall', 'archer'], enemies: ['normal'] },
  { id: '1-2', name: '疾风', chapter: 'tutorial', waves: 3, startGold: 620, goldBonus: 50, unlock: ['wall', 'archer', 'ice'], enemies: ['normal', 'fast'] },
  { id: '1-3', name: '铁壁', chapter: 'tutorial', waves: 4, startGold: 600, goldBonus: 55, unlock: ['wall', 'archer', 'ice', 'cannon'], enemies: ['normal', 'fast'] },
  { id: '1-4', name: '毒雾', chapter: 'tutorial', waves: 4, startGold: 580, goldBonus: 65, unlock: ['all'], enemies: ['normal', 'fast', 'tank'] },
  { id: '1-5', name: '雷霆', chapter: 'tutorial', waves: 5, startGold: 550, goldBonus: 80, unlock: ['all'], enemies: ['normal', 'fast', 'tank'], boss: true },
  { id: '2-1', name: '暗流', chapter: 'basics', waves: 5, startGold: 530, goldBonus: 90, unlock: ['all'], enemies: ['normal', 'fast', 'scout'] },
  { id: '2-2', name: '破壁', chapter: 'basics', waves: 6, startGold: 510, goldBonus: 100, unlock: ['all'], enemies: ['normal', 'fast', 'destroyer'] },
  { id: '2-3', name: '幻形', chapter: 'basics', waves: 6, startGold: 500, goldBonus: 110, unlock: ['all'], enemies: ['normal', 'fast', 'shifter'] },
  { id: '2-4', name: '混战', chapter: 'basics', waves: 7, startGold: 490, goldBonus: 120, unlock: ['all'], enemies: ['normal', 'fast', 'tank', 'scout'] },
  { id: '2-5', name: '狂潮', chapter: 'basics', waves: 8, startGold: 470, goldBonus: 140, unlock: ['all'], enemies: ['all'], boss: true },
  { id: '3-1', name: '冰火', chapter: 'advanced', waves: 6, startGold: 450, goldBonus: 150, unlock: ['all'], enemies: ['fast', 'tank', 'destroyer'] },
  { id: '3-2', name: '毒雷', chapter: 'advanced', waves: 7, startGold: 440, goldBonus: 160, unlock: ['all'], enemies: ['tank', 'scout', 'shifter'] },
  { id: '3-3', name: '连锁', chapter: 'advanced', waves: 7, startGold: 430, goldBonus: 170, unlock: ['all'], enemies: ['normal', 'fast', 'scout', 'destroyer'] },
  { id: '3-4', name: '逆克', chapter: 'advanced', waves: 8, startGold: 420, goldBonus: 180, unlock: ['all'], enemies: ['all'] },
  { id: '3-5', name: '元素', chapter: 'advanced', waves: 9, startGold: 400, goldBonus: 200, unlock: ['all'], enemies: ['all'], boss: true },
  { id: '4-1', name: '记忆', chapter: 'challenge', waves: 8, startGold: 380, goldBonus: 210, unlock: ['all'], enemies: ['normal', 'fast', 'scout', 'destroyer'] },
  { id: '4-2', name: '适应', chapter: 'challenge', waves: 9, startGold: 370, goldBonus: 220, unlock: ['all'], enemies: ['all'] },
  { id: '4-3', name: '进化', chapter: 'challenge', waves: 10, startGold: 360, goldBonus: 230, unlock: ['all'], enemies: ['all'] },
  { id: '4-4', name: '绝境', chapter: 'challenge', waves: 11, startGold: 350, goldBonus: 245, unlock: ['all'], enemies: ['all'] },
  { id: '4-5', name: '终焉', chapter: 'challenge', waves: 12, startGold: 340, goldBonus: 260, unlock: ['all'], enemies: ['all'], boss: true },
  { id: '5-1', name: '噩梦', chapter: 'elite', waves: 10, startGold: 320, goldBonus: 270, unlock: ['all'], enemies: ['all'] },
  { id: '5-2', name: '地狱', chapter: 'elite', waves: 11, startGold: 310, goldBonus: 285, unlock: ['all'], enemies: ['all'] },
  { id: '5-3', name: '深渊', chapter: 'elite', waves: 12, startGold: 305, goldBonus: 300, unlock: ['all'], enemies: ['all'] },
  { id: '5-4', name: '炼狱', chapter: 'elite', waves: 13, startGold: 300, goldBonus: 320, unlock: ['all'], enemies: ['all'] },
  { id: '5-5', name: '封神', chapter: 'elite', waves: 15, startGold: 300, goldBonus: 350, unlock: ['all'], enemies: ['all'], boss: true }
];