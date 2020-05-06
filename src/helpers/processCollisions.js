import hitTestRectangle from './hitTestRectangle';

export default function processCollisions(entitiesA, entitiesB, callback) {
  entitiesA.forEach((entityA) => {
    const hitEntityB = entitiesB.find(
      (entityB) => entityA.visible
        && entityB.visible
        && entityA.canBeHit
        && entityB.canBeHit
        && hitTestRectangle(entityA, entityB, true)
    );

    if (hitEntityB) {
      callback(entityA, hitEntityB);
    }
  });
}
