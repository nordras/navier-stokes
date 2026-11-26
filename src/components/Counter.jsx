import { animate } from 'motion/react'
import { useEffect, useState } from 'react'

export default function Counter({ to, duration = 1.8, delay = 0, format = (n) => Math.round(n).toLocaleString('en-US') }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: setVal })
    return () => c.stop()
  }, [to, duration, delay])
  return <>{format(val)}</>
}
