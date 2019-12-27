// Return true if there is an overlap between two rectangles
export default function hitTestRectangle(r1, r2, global = false) {
  if (!r1.halfWidth) r1.halfWidth = r1.width / 2;
  if (!r1.halfHeight) r1.halfHeight = r1.height / 2;
  if (!r1.anchorOffsetX) r1.anchorOffsetX = r1.anchor.x * r1.width;
  if (!r1.anchorOffsetY) r1.anchorOffsetY = r1.anchor.y * r1.height;

  if (!r2.halfWidth) r2.halfWidth = r2.width / 2;
  if (!r2.halfHeight) r2.halfHeight = r2.height / 2;
  if (!r2.anchorOffsetX) r2.anchorOffsetX = r2.anchor.x * r2.width;
  if (!r2.anchorOffsetY) r2.anchorOffsetY = r2.anchor.y * r2.height;

  if (global) {
    r1.centerX = r1.getGlobalPosition().x + r1.halfWidth - r1.anchorOffsetX;
    r1.centerY = r1.getGlobalPosition().y + r1.halfHeight - r1.anchorOffsetY;
    r2.centerX = r2.getGlobalPosition().x + r2.halfWidth - r2.anchorOffsetX;
    r2.centerY = r2.getGlobalPosition().y + r2.halfHeight - r2.anchorOffsetY;
  } else {
    r1.centerX = r1.x + r1.halfWidth - r1.anchorOffsetX;
    r1.centerY = r1.y + r1.halfHeight - r1.anchorOffsetY;
    r2.centerX = r2.x + r2.halfWidth - r2.anchorOffsetX;
    r2.centerY = r2.y + r2.halfHeight - r2.anchorOffsetY;
  }

  if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
  && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
    return true;
  }

  return false;
}
