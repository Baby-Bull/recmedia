const scrollEl = (el) => {
  if (el) {
    el.scroll({ top: el.scrollHeight ?? 10000, left: 0, behavior: "smooth" });
  }
};
export default scrollEl;
