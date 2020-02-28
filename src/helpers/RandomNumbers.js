// Return a random integer between min and max included
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Math.random() returns random number between 0 (inclusive) and 1 (exclusive)
// This function returns a random float between min (inclusive) and max (exclusive)
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
