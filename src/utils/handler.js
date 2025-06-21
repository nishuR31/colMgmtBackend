export default function Handler(func) {
  return function () {
    try {
      func();
    } catch (err) {
      console.error(`Error occurred: ${err.message}`);
    }
  };
}
