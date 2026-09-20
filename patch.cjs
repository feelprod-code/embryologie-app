const fs = require('fs');

const file = 'src/components/VideoPlayerPage.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  const [activeLayout, setActiveLayout] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (deviceClass === 'mobile') return 'mobile';
    if (deviceClass === 'tablet') return 'tablet';
    return window.innerWidth < 1024 ? 'tablet' : 'desktop';
  });`,
`  const [activeLayout, setActiveLayout] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    if (Math.min(window.innerWidth, window.innerHeight) <= 450) return 'mobile';
    if (deviceClass === 'tablet') return 'tablet';
    return window.innerWidth < 1024 ? 'tablet' : 'desktop';
  });`
);

code = code.replace(
`  useEffect(() => {
    if (isFullscreen) return;

    if (deviceClass === 'mobile') {
      setActiveLayout('mobile');
    } else if (deviceClass === 'tablet') {
      setActiveLayout('tablet');
    } else {
      if (windowSize.width < 1024) {
        setActiveLayout('tablet');
      } else {
        setActiveLayout('desktop');
      }
    }
  }, [windowSize, isFullscreen, deviceClass]);`,
`  useEffect(() => {
    if (isFullscreen) return;

    if (Math.min(windowSize.width, windowSize.height) <= 450 || deviceClass === 'mobile') {
      setActiveLayout('mobile');
    } else if (deviceClass === 'tablet') {
      setActiveLayout('tablet');
    } else {
      if (windowSize.width < 1024) {
        setActiveLayout('tablet');
      } else {
        setActiveLayout('desktop');
      }
    }
  }, [windowSize, isFullscreen, deviceClass]);`
);

fs.writeFileSync(file, code);
