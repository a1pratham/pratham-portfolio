import { useEffect, useState } from 'react';

/** True once the referenced element has entered the viewport. */
export default function useInView(ref, { rootMargin = '0px 0px -48px 0px', threshold = 0.1 } = {}) {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (inView || !node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin, threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, inView, rootMargin, threshold]);

  return inView;
}
