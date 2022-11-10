const EQUAL = 0;
const LESS_THAN = 1;
const GREATER_THAN = 2;

function cmp(a: number, b: number) {
    if (a === b) {
      return EQUAL;
    } else if (a < b) {
      return LESS_THAN;
    } else {
      return GREATER_THAN;
    }
}
  
function compare(symbolX: string, symbolY: string) {
    const lenCmp = cmp(symbolX.length, symbolY.length);
    if (lenCmp != EQUAL) {
      return lenCmp;
    }
    let i = 0;
    while (i < symbolX.length && i < symbolY.length) {
      const elem_cmp = cmp(symbolX.charCodeAt(i), symbolY.charCodeAt(i));
      if (elem_cmp != EQUAL) return elem_cmp;
      i++;
    }
    return EQUAL;
}
  
export function isSortedSymbols(symbolX: string, symbolY: string) {
    return compare(symbolX, symbolY) === LESS_THAN;
}

export function extractAddressFromType(type: string) {
    return type.split('::')[0];
}

export function checkPairValid(coinX:string, coinY:string) {
  if (!coinX || !coinY) {
    return false;
  }
  if (coinX == coinY) {
    return false;
  }

  return true;

}