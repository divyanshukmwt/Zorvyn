import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ANIMATION_DURATION_MS = 1200;

function useAnimatedCounter(target, duration = ANIMATION_DURATION_MS) {
  const [current, setCurrent] = useState(0);
  const objRef = useRef({ value: 0 });
  const tweenRef = useRef(null);

  useEffect(() => {
    if (tweenRef.current) tweenRef.current.kill();

    tweenRef.current = gsap.to(objRef.current, {
      value: target,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: () => {
        setCurrent(objRef.current.value);
      },
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [target, duration]);

  return current;
}

export default useAnimatedCounter;
