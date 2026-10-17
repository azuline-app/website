// Light/dark toggle; the choice is remembered on this device. Switching floods the new theme across the whole
// page as an ink splat from the toggle, logo included (View Transitions). Without them, or when the visitor
// prefers less motion, the theme switches at once.
const KEY = 'azu-theme';
const rand = (a: number, b: number) => a + Math.random() * (b - a);

// the splat used as the mask: a lumpy disc with a few long spikes, plus droplets thrown ahead of it.
// viewBox is 300 units wide; the disc's smallest radius is about 52 units.
function splatMask(): string {
  const n = 28;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.07, 0.07);
    const r = Math.random() < 0.22 ? rand(72, 96) : rand(52, 62);
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0])
    .map((v) => v.toFixed(1))
    .join(' ')}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += `Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  let drops = '';
  for (let i = 0; i < 9; i++) {
    const a = rand(0, Math.PI * 2);
    const r = rand(100, 140);
    drops += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="${rand(3, 9).toFixed(1)}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-150 -150 300 300"><g fill="#000"><path d="${d}Z"/>${drops}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function initThemeToggle(button: HTMLButtonElement): void {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const apply = (t: string) => {
    root.dataset.theme = t;
    button.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  apply(root.dataset.theme ?? 'light');

  button.addEventListener('click', async () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const swap = () => {
      localStorage.setItem(KEY, next);
      apply(next);
    };
    if (still || !document.startViewTransition) return swap();

    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const end = (far / (52 / 300)) * 1.08; // mask width at which the disc covers every corner
    const mask = splatMask();
    const style = document.createElement('style');
    style.textContent = `::view-transition-new(root){-webkit-mask-image:${mask};mask-image:${mask};-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}`;
    document.head.appendChild(style);
    root.classList.add('vt');
    const vt = document.startViewTransition(swap);
    try {
      await vt.ready;
      const at = (s: number) => ({
        maskSize: `${s}px ${s}px`,
        WebkitMaskSize: `${s}px ${s}px`,
        maskPosition: `${x - s / 2}px ${y - s / 2}px`,
        WebkitMaskPosition: `${x - s / 2}px ${y - s / 2}px`,
      });
      root.animate(
        [
          { ...at(0), offset: 0 },
          { ...at(end * 0.1), offset: 0.16 },
          { ...at(end * 0.085), offset: 0.26 },
          { ...at(end * 0.45), offset: 0.62 },
          { ...at(end), offset: 1 },
        ],
        {
          duration: 1000,
          easing: 'cubic-bezier(.3,.6,.25,1)',
          pseudoElement: '::view-transition-new(root)',
          fill: 'forwards',
        },
      );
      await vt.finished;
    } finally {
      root.classList.remove('vt');
      style.remove();
    }
  });
}
