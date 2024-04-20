/** Parameters for the {@link Circle} constructor. */
export interface CircleParameters {
  /** Horizontal position of the circle. */
  x: number;
  /** Vertical position of the circle. */
  y: number;
  /** Horizontal velocity of the circle. */
  velX: number;
  /** Vertical velocity of the circle. */
  velY: number;
  /** Circle radius. */
  radius: number;
}

/** A circle for the {@link CirclesSimulation}. */
export class Circle {
  /** Circle radius. */
  #radius: number = 0;
  /** Animation frame handler for the radius transition. */
  #radiusTransitionID?: number | undefined;

  /**
   * Sets the new radius of the circle. The circle will gradually transition to
   * the specified radius.
   * @param targetRadius - New radius of the circle.
   */
  set radius(targetRadius: number) {
    if (this.#radiusTransitionID != null) {
      cancelAnimationFrame(this.#radiusTransitionID);
      this.#radiusTransitionID = undefined;
    }

    // Slowly interpolate the circle's radius from the current radius to the
    // target radius.
    let lastTimestamp: number | undefined;
    const radiusTransition = (timestamp: number): void => {
      const dt = timestamp - (lastTimestamp ?? timestamp);
      lastTimestamp = timestamp;

      if (Math.abs(targetRadius - this.#radius) > 1) {
        this.#radius +=
          ((targetRadius - this.#radius) / 1000) * Math.min(1000, dt);
        this.#radiusTransitionID = requestAnimationFrame(radiusTransition);
      } else {
        this.#radius = targetRadius;
      }
    };
    this.#radiusTransitionID = requestAnimationFrame(radiusTransition);
  }

  /**
   * Circle radius.
   * @returns Radius of the circle.
   */
  get radius(): number {
    return this.#radius;
  }

  /** Horizontal position of the circle. */
  x: number;
  /** Vertical position of the circle. */
  y: number;

  /** Horizontal velocity of the circle. */
  velX: number;
  /** Vertical velocity of the circle. */
  velY: number;

  /**
   * Creates a new {@link Circle}.
   * @param parameters - Circle construction parameters.
   */
  constructor(parameters: CircleParameters) {
    this.x = parameters.x;
    this.y = parameters.y;
    this.velX = parameters.velX;
    this.velY = parameters.velY;
    this.radius = parameters.radius;
  }
}

export default Circle;
