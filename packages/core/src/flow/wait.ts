export default function wait(callback: Function) {
  (async () => {
    await callback();
  })();
}
