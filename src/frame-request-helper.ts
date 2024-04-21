/** Parameters for {@link FrameRequestHelperCallback}. */
export interface FrameRequestHelperCallbackParameters {
  /** Timestamp where last frame ended. */
  timestamp: number;
  /** Time elapsed since the callback was last called. */
  deltaTime: number;
}

/** Callback to be used with {@link FrameRequestHelper}. */
export type FrameRequestHelperCallback = (
  parameters: FrameRequestHelperCallbackParameters,
) => void;

/** Simplifies the use of {@link requestAnimationFrame}. */
export class FrameRequestHelper {
  #callback: FrameRequestHelperCallback;
  #requestID?: number | undefined;
  #lastTimestamp?: number | undefined;

  /**
   * Constructs a {@link FrameRequestHelper}.
   * @param callback - Callback to run at every frame once {@link start} is
   * called.
   */
  constructor(callback: FrameRequestHelperCallback) {
    this.#callback = callback;
  }

  /** Starts running the provided callback at every frame. */
  start(): void {
    if (this.#requestID != null) return;

    const callback = (timestamp: number): void => {
      const deltaTime = timestamp - (this.#lastTimestamp ?? timestamp);

      this.#lastTimestamp = timestamp;

      // The next animation frame is requested before callback runs, so that the
      // callback itself can cancel it by using the instance methods.
      this.#requestID = requestAnimationFrame(callback);
      this.#callback({ timestamp, deltaTime });
    };

    this.#requestID = requestAnimationFrame(callback);
  }

  /**
   * Stops running the provided callback at every frame.
   * No-op if {@link start} has not been called.
   */
  stop(): void {
    if (this.#requestID == null) return;

    cancelAnimationFrame(this.#requestID);
    this.#lastTimestamp = undefined;
    this.#requestID = undefined;
  }
}

export default FrameRequestHelper;
