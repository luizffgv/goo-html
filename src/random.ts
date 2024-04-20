/**
 * Returns a pseudorandom number between -1 and 1.
 * @returns Random number between -1 and 1.
 */
export function SignedRandom(): number {
  return (Math.random() - 0.5) * 2;
}
