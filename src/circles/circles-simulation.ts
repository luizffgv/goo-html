import { throwIfNull } from "@luizffgv/ts-conversions";
import Circle from "./circle.js";
import { SignedRandom } from "../random.js";

/** Parameters for the {@link CirclesSimulation} constructor. */
export interface CirclesSimulationParameters {
  /** Canvas where the simulation is drawn. */
  canvas: HTMLCanvasElement;
  /** Number of circles to exist at any given moment. */
  circleCount: number;
  /** Radius of the circles or a function that generates the radius. */
  circleRadius: number | (() => number);
  /** Color of the circles. */
  circleColor: string;
  /** Speed multiplier for the simulation. */
  speedMultiplier?: number | undefined;
}

export class CirclesSimulation {
  /** Canvas where the simulation is drawn. */
  #canvas: HTMLCanvasElement;

  /** Circles currently being simulated and drawn. */
  #circles: Circle[] = [];

  /** Canvas context used for drawing. */
  #ctx: CanvasRenderingContext2D;

  /** Function that generates the radius of each circle. */
  #circleRadius: () => number;

  /** Radius of the circles. */
  set circleRadius(circleRadius: number | (() => number)) {
    this.#circleRadius =
      typeof circleRadius === "function" ? circleRadius : () => circleRadius;

    for (const circle of this.#circles) {
      circle.radius = this.#circleRadius();
    }
  }

  /** Number of circles to exist at any given moment. */
  circleCount: number;

  /** Color of the circles. */
  circleColor: string;

  /** Speed multiplier for the simulation. */
  speedMultiplier: number;

  /**
   * Creates a new {@link CirclesSimulation}.
   * @param parameters - Simulation construction parameters.
   * @param parameters.speedMultiplier - See {@link CirclesSimulationParameters.speedMultiplier}.
   */
  constructor({
    speedMultiplier = 1,
    ...parameters
  }: CirclesSimulationParameters) {
    this.#canvas = parameters.canvas;
    this.circleCount = parameters.circleCount;
    this.circleColor = parameters.circleColor;
    this.speedMultiplier = speedMultiplier;

    const circleRadius = parameters.circleRadius;
    this.#circleRadius =
      typeof circleRadius === "function" ? circleRadius : () => circleRadius;

    this.#ctx = throwIfNull(this.#canvas.getContext("2d"));
  }

  /**
   * Updates the simulation.
   * @param dt - Time elapsed since the last update, in milliseconds.
   */
  update(dt: number): void {
    // Remove circles that have left the canvas, with some wiggle room to
    // account for effects.
    this.#circles = this.#circles.filter(
      (circle) =>
        circle.x - circle.radius * 2 < this.#canvas.width &&
        circle.y - circle.radius * 2 < this.#canvas.height &&
        circle.x + circle.radius * 2 > 0 &&
        circle.y + circle.radius * 2 > 0,
    );

    // Add new circles until the desired number is reached
    while (this.#circles.length < this.circleCount) {
      this.#circles.push(
        new Circle({
          x: Math.random() * this.#canvas.width,
          y: Math.random() * this.#canvas.height,
          velX: 0,
          velY: 0,
          radius: this.#circleRadius(),
        }),
      );
    }

    // Update circle velocities and positions
    for (const circle of this.#circles) {
      circle.velX += (SignedRandom() * dt) / 10000;
      circle.velY += (SignedRandom() * dt) / 10000;
      circle.velX = Math.min(0.025, circle.velX);
      circle.velY = Math.min(0.025, circle.velY);

      circle.x += circle.velX * dt * this.speedMultiplier;
      circle.y += circle.velY * dt * this.speedMultiplier;
    }
  }

  /** Draws the current simulation state to the canvas. */
  draw(): void {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    this.#ctx.fillStyle = this.circleColor;
    for (const circle of this.#circles) {
      this.#ctx.beginPath();
      this.#ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      this.#ctx.fill();
    }

    this.#ctx.filter = "none";
  }
}

export default CirclesSimulation;
