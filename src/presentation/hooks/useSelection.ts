"use client";

import { parseAsInteger, useQueryStates } from "nuqs";

export function useSelection() {
  const [state, setState] = useQueryStates({
    c1: parseAsInteger,
    c2: parseAsInteger,
    p1: parseAsInteger.withDefault(1),
    p2: parseAsInteger.withDefault(1),
  });

  return {
    c1: state.c1,
    c2: state.c2,
    p1: state.p1,
    p2: state.p2,
    selectFirst: (id: number | null) => setState({ c1: id }),
    selectSecond: (id: number | null) => setState({ c2: id }),
    setPage1: (page: number) => setState({ p1: page }),
    setPage2: (page: number) => setState({ p2: page }),
    swap: () => setState({ c1: state.c2, c2: state.c1 }),
    clear: () => setState({ c1: null, c2: null }),
  };
}
