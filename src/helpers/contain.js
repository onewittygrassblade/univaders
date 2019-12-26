// Return a set containing collision labels between a sprite and a container
export default function contain(sprite, container) {
  let collision = new Set();

  if (!sprite.anchorOffsetX) sprite.anchorOffsetX = sprite.anchor.x * sprite.width;
  if (!sprite.anchorOffsetY) sprite.anchorOffsetY = sprite.anchor.y * sprite.height;

  if (sprite.x - sprite.anchorOffsetX < container.x) {
    sprite.x = container.x;
    collision.add('left');
  }

  if (sprite.x + sprite.width - sprite.anchorOffsetX > container.x + container.width) {
    sprite.x = container.x + container.width - sprite.width + sprite.anchorOffsetX;
    collision.add('right');
  }

  if (sprite.y - sprite.anchorOffsetY < container.y) {
    sprite.y = container.y + sprite.anchorOffsetY;
    collision.add('top');
  }

  if (sprite.y + sprite.height - sprite.anchorOffsetY > container.y + container.height) {
    sprite.y = container.y + container.height - sprite.height + sprite.anchorOffsetY;
    collision.add('bottom');
  }

  if (collision.size === 0) {
    collision = undefined;
  }

  return collision;
}
