export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
