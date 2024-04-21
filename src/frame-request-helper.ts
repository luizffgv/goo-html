/**
 * Parameters for {@link FrameRequestHelperCallback}.
 * @template Data Data type to pass to the callback every frame.
 */
export interface FrameRequestHelperCallbackParameters<Data = undefined> {
  /** Timestamp where last frame ended. */
  timestamp: number;
  /** Time elapsed since the callback was last called. */
  deltaTime: number;
  /** Data passed to the callback every frame. */
  data: Data;
}

/**
 * Callback to be used with {@link FrameRequestHelper}.
 * @template Data Data type to pass to the callback every frame.
 */
export type FrameRequestHelperCallback<Data = undefined> = (
  parameters: FrameRequestHelperCallbackParameters<Data>,
) => void;

/**
 * Simplifies the use of {@link requestAnimationFrame}.
 * @template Data Data type to pass to the callback every frame.
 */
export class FrameRequestHelper<Data = undefined> {
  #callback: FrameRequestHelperCallback<Data>;
  #requestID?: number | undefined;
  #lastTimestamp?: number | undefined;

  /**
   * Constructs a {@link FrameRequestHelper}.
   * @param callback - Callback to run at every frame once {@link start} is
   * called.
   */
  constructor(callback: FrameRequestHelperCallback<Data>) {
    this.#callback = callback;
  }

  /**
   * Starts running the provided callback at every frame.
   * @param data - Data to pass to the callback every frame.
   */
  start(...data: Data extends undefined ? [] : [Data]): void {
    if (this.#requestID != null) return;

    const callback = (timestamp: number): void => {
      const deltaTime = timestamp - (this.#lastTimestamp ?? timestamp);

      this.#lastTimestamp = timestamp;

      // The next animation frame is requested before callback runs, so that the
      // callback itself can cancel it by using the instance methods.
      this.#requestID = requestAnimationFrame(callback);
      this.#callback({ timestamp, deltaTime, data: data[0] as Data });
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
