export const abortWrapper = (p1) => {
  let abort;
  let p2 = new Promise((resolve, reject) => (abort = reject));
  let p = Promise.race([p1, p2]);
  p.abort = abort;
  return p;
};
