import FrameRequestHelper from "../frame-request-helper.js";

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
  /** Interpolates from the current radius to the target radius. */
  #radiusInterpolator = new FrameRequestHelper<{ targetRadius: number }>(
    ({ deltaTime, data: { targetRadius } }) => {
      if (Math.abs(targetRadius - this.#radius) > 1) {
        this.#radius +=
          ((targetRadius - this.#radius) / 1000) * Math.min(1000, deltaTime);
      } else {
        this.#radius = targetRadius;
        this.#radiusInterpolator.stop();
      }
    },
  );

  /**
   * Sets the new radius of the circle. The circle will gradually transition to
   * the specified radius.
   * @param targetRadius - New radius of the circle.
   */
  set radius(targetRadius: number) {
    this.#radiusInterpolator.stop();
    this.#radiusInterpolator.start({ targetRadius });
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
