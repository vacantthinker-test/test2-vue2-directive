import {Observer} from "./Observer";

export function observe(value) {
  if (typeof value !== 'object') {
    return;
  }
  let ob;
  if (value.__ob__ === undefined) {
    ob = new Observer(value);
  } else {
    ob = value.__ob__;
  }
  return ob;
}