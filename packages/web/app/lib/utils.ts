import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function asyncReduce<T, U>(
  array: T[],
  callback: (
    accumulator: U,
    currentValue: T,
    index: number,
    array: T[],
  ) => Promise<U>,
  initialValue: U,
): Promise<U> {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await callback(accumulator, array[i], i, array);
  }

  return accumulator;
}
