export function wait(callback: Function) {
  (async () => {
    await callback();
  })();
}
