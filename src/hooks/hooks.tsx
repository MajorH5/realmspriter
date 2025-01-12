// https://stackoverflow.com/questions/75594366/react-useapi-hook-results-in-endless-loop-when-used-in-useeffect
import { DependencyList, useState, useEffect } from "react";

type UseAsyncHookState<T> = {
    loading: boolean,
    error: null  | Error,
    data: null | T
};

function useAsync<T>(func:() => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<UseAsyncHookState<T>>({ loading: true, error: null, data: null });

  useEffect(() => {
      let mounted = true
      func()
        .then(data => mounted && setState({ loading: false, error: null, data }))
        .catch(error => mounted && setState({ loading: false, error, data: null }))
      return () => { mounted = false }
    }, deps);

  return state;
};

export { useAsync };
