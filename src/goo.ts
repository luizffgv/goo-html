import CirclesSimulation from "./circles/circles-simulation.js";
import FrameRequestHelper from "./frame-request-helper.js";
import { css, html } from "./tags.js";
import { throwIfNull, trySpecify } from "@luizffgv/ts-conversions";

/**
 * An element that renders a simulation of gooey circles.
 *
 * It uses the following **required** attributes:
 * - `radius`: the radius of the circles.
 * - `count`: the number of circles to simulate at once.
 * - `color`: the color of the circles.
 *
 * It uses the following **optional** attributes:
 * - `speed`: the speed multiplier for the simulation.
 * @example
 * ```html
 * <goo-simulation
 *   radius="50"
 *   count="10"
 *   color="pink"
 *   style="width: 100%; height: 100%"
 * >
 * </goo-simulation>
 * ```
 */
export class Goo extends HTMLElement {
  static #template = html`<div id="container">
    <svg id="gooey-filter-svg">
      <defs>
        <filter id="gooey-filter">
          <feGaussianBlur id="blur-step" in="SourceGraphic" stdDeviation="0" />
          <feComponentTransfer in="blur">
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
    <canvas id="canvas"></canvas>
  </div>`;

  static #styles = new CSSStyleSheet();
  static {
    this.#styles.replaceSync(css`
      :host {
        display: block;
        container-type: size;
      }

      #container {
        height: 100%;
        width: 100%;
      }

      #gooey-filter-svg {
        position: absolute;
        width: 0;
        height: 0;
      }

      #canvas {
        height: 100%;
        width: 100%;

        filter: url(#gooey-filter);
      }
    `);
  }

  static observedAttributes = ["radius", "count", "color", "speed"] as const;

  /** The component's shadow root, never `undefined` or `null`. */
  #shadowRoot: ShadowRoot;

  /** ResizeObserver for the container. It is used to resize the canvas. */
  #containerResizeObserver?: ResizeObserver | undefined;

  /** The {@link CirclesSimulation} being run. */
  #simulation?: CirclesSimulation | undefined;

  /** Runs the simulation and draws it at every frame. */
  #simulationFrameRequestHelper = new FrameRequestHelper(({ deltaTime }) => {
    const simulation = throwIfNull(this.#simulation);
    simulation.update(deltaTime);
    simulation.draw();
  });

  /** Intersection observer used for pausing and resuming the simulation. */
  #intersectionObserver?: IntersectionObserver | undefined;

  /**
   * The component's `<canvas>` element.
   * @returns A `<canvas>` element.
   */
  get #canvas(): HTMLCanvasElement {
    return trySpecify(
      this.#shadowRoot.querySelector("#canvas"),
      HTMLCanvasElement,
    );
  }

  /** The standard deviation of the blur filter. */
  set #blur(value: number) {
    throwIfNull(this.#shadowRoot.querySelector("#blur-step")).setAttribute(
      "stdDeviation",
      String(value),
    );
  }

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: "closed" });
    this.#shadowRoot.adoptedStyleSheets.push(Goo.#styles);
    this.#shadowRoot.innerHTML = Goo.#template;
  }

  attributeChangedCallback(
    name: (typeof Goo.observedAttributes)[number],
    oldValue: string,
    newValue: string,
  ): void {
    if (oldValue === newValue) return;

    if (this.#simulation == null) return;

    switch (name) {
      case "radius": {
        const newRadius = Number.parseInt(newValue);
        this.#simulation.circleRadius = newRadius;
        this.#blur = newRadius / 8;
        break;
      }
      case "count": {
        this.#simulation.circleCount = Number.parseInt(newValue);
        break;
      }
      case "color": {
        this.#simulation.circleColor = newValue;
        break;
      }
      case "speed": {
        this.#simulation.speedMultiplier = Number.parseFloat(newValue);
        break;
      }
    }
  }

  connectedCallback(): void {
    const circleRadius = Number.parseInt(this.getAttribute("radius") ?? "0");

    this.#blur = circleRadius / 8;

    this.#simulation = new CirclesSimulation({
      canvas: this.#canvas,
      circleCount: Number.parseInt(this.getAttribute("count") ?? "0"),
      circleRadius: circleRadius,
      circleColor: this.getAttribute("color") ?? "transparent",
      speedMultiplier: Number.parseFloat(this.getAttribute("speed") ?? "1"),
    });

    this.#canvas.width = this.offsetWidth;
    this.#canvas.height = this.offsetHeight;

    this.#containerResizeObserver = new ResizeObserver((entries) => {
      this.#canvas.width = entries[0].contentRect.width;
      this.#canvas.height = entries[0].contentRect.height;
    });
    this.#containerResizeObserver.observe(this);

    this.#intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.#simulationFrameRequestHelper.start();
      } else {
        this.#simulationFrameRequestHelper.stop();
      }
    });
    this.#intersectionObserver.observe(this);
  }

  disconnectedCallback(): void {
    this.#containerResizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();

    this.#simulationFrameRequestHelper.stop();
  }
}

customElements.define("goo-simulation", Goo);

declare global {
  interface HTMLElementTagNameMap {
    "goo-simulation": Goo;
  }
}

export default Goo;
