// useLayer(active): registers the calling overlay in the layer stack while active is true and returns its id.
// Use it with isTopLayer(id) from utils/layers.js so Esc only closes the top overlay.
import { useEffect, useRef } from 'react';
import { registerLayer } from '../utils/layers.js';

let nextId = 0;

const useLayer = (active) => {
  const idRef = useRef(null);
  if (idRef.current === null) idRef.current = ++nextId;

  useEffect(() => (active ? registerLayer(idRef.current) : undefined), [active]);

  return idRef.current;
};

export default useLayer;
