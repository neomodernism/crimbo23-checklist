import { print, getMonsters, Monster, monsterFactoidsAvailable, itemDropsArray, haveSkill, getRevision } from "kolmafia";
import { $locations, $monsters, $items, $skills, CombatLoversLocket, have } from "libram";

function doMonster(
  monster: Monster,
  locketMonsters: Monster[],
  hasLocket: boolean
): boolean {
  const locketed = locketMonsters.includes(monster);
  const factoidsLeft = 3 - monsterFactoidsAvailable(monster, true);
  const ignoreItems = $items`Elf Guard MPC, Crimbuccaneer piece of 12, plum, orange, lemon, cherry, strawberry, pear, lemon, grapefruit, lime, raspberry, kumquat, peach, papaya, kiwi, blackberry, tangerine, bottle of gin, bottle of rum, bottle of vodka, bottle of tequila, bottle of whiskey, boxed wine`;

  const drops = itemDropsArray(monster).map(each => each.drop).filter(each => !ignoreItems.includes(each));
  const haveDrops = drops.filter(each => have(each));
  const needDrops = drops.filter(each => !have(each));

  if ((locketed || !hasLocket) && factoidsLeft === 0 && needDrops.length === 0) {
    print(`${monster.name} ... DONE`, 'green');
    return true;
  } 

  print();
  print(monster.name, 'black');
  if (hasLocket) {
    if (locketed) print('&#9745; in locket', 'black');
    else print('&#9744; not in locket', 'red');
  }
  if (factoidsLeft === 0) {
    print('&#9745; have all factoids', 'black');
  } else {
    print(`&#9744; ${factoidsLeft} factoids remaining`, 'red')
  }
  haveDrops.forEach(each => print(`&#9745; have ${each.name}`, 'black'));
  needDrops.forEach(each => print(`&#9744; need ${each.name}`, 'red'));
  return false;
}

export function main(): void {
  print('--------------------------------------')
  print('Crimbo 23 Checklist')
  print('--------------------------------------')

  if (getRevision() < 27742) {
    print('This script requires mafia version >= 27742. Please update mafia.', 'red');
    return;
  }

  let hasLocket = CombatLoversLocket.have();
  if (hasLocket && CombatLoversLocket.reminiscesLeft() === 0) {
    hasLocket = false;
    print('No reminisces left, skipping locket.', 'red');
  }

  print();

  const locations = $locations`Abuela's Cottage (Contested), The Embattled Factory, The Bar At War, A Cafe Divided, The Armory Up In Arms`;
  const genericMonsters = $monsters`Crimbuccaneer military school dropout, Crimbuccaneer new recruit, Crimbuccaneer privateer, Elf Guard conscript, Elf Guard convict, Elf Guard private`;
  const locketMonsters = hasLocket ? CombatLoversLocket.unlockedLocketMonsters() : [ ];

  print('Generic Monsters', 'blue');
  genericMonsters.forEach(monster =>
    doMonster(monster, locketMonsters, hasLocket)
  );
  print();
  print();

  locations.forEach(location => {
    print(location.toString(), 'blue');

    getMonsters(location).filter(monster => !genericMonsters.includes(monster)).forEach(monster =>
      doMonster(monster, locketMonsters, hasLocket)
    );
    print();
    print();
  });

  print('Skills', 'blue');
  print();
  const skills = $skills`Fruit Recognition, Old-School Cocktailcrafting, Elf Guard Cooking, Elf Guard Relaxation Techniques, Elf Guard Extortion Techniques`;
  skills.forEach((skill) => {
    if (haveSkill(skill)) print(`&#9745; ${skill.name}`, 'green');
    else print(`&#9744; ${skill.name}`, 'red')
  });
  print();
}
