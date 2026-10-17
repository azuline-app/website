// Ink hover: a splat lands where the pointer enters a button. Droplets fly out past the edge and fade on the
// page, while the splat spreads inside the button until it is flooded. Outline buttons take navy ink, dark
// buttons azure. Off when the visitor prefers less motion.
const NS = 'http://www.w3.org/2000/svg';
const rand = (a: number, b: number) => a + Math.random() * (b - a);

// a splat outline: a lumpy disc with a few long spikes, smoothed through the midpoints
function splatPath(): string {
  const n = 26;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.08, 0.08);
    const r = Math.random() < 0.22 ? rand(1.25, 1.7) : rand(0.86, 1.06);
    pts.push([Math.cos(a) * r * 50, Math.sin(a) * r * 50]);
  }
  const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).join(' ')}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

function spread(b: HTMLElement, e: PointerEvent): void {
  for (const s of b.querySelectorAll('.inkb')) s.remove();
  const r = b.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const color = getComputedStyle(b).getPropertyValue('--inkc').trim() || '#0f1d2e';
  const R = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 1.15;

  // the splat inside the button
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  svg.classList.add('inkb');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', splatPath());
  path.setAttribute('fill', color);
  svg.appendChild(path);
  Object.assign(svg.style, { left: `${x}px`, top: `${y}px`, width: `${R * 2}px`, height: `${R * 2}px` });
  b.appendChild(svg);
  const rot = rand(-40, 40);
  svg.animate(
    [
      { transform: `translate(-50%,-50%) scale(0) rotate(${rot}deg)` },
      { transform: `translate(-50%,-50%) scale(.46) rotate(${rot + 8}deg)`, offset: 0.14 },
      { transform: `translate(-50%,-50%) scale(.4) rotate(${rot + 10}deg)`, offset: 0.24 },
      { transform: `translate(-50%,-50%) scale(1.3) rotate(${rot + 18}deg)`, offset: 0.58 },
      { transform: `translate(-50%,-50%) scale(2.35) rotate(${rot + 26}deg)` },
    ],
    { duration: 760, easing: 'cubic-bezier(.3,.6,.25,1)', fill: 'forwards' },
  );

  // droplets thrown out of the button onto the page; they shrink and dry within a second
  const layer = document.createElementNS(NS, 'svg');
  layer.classList.add('inks');
  Object.assign(layer.style, { left: `${e.clientX}px`, top: `${e.clientY}px` });
  document.body.appendChild(layer);
  const base = Math.atan2(y - r.height / 2, x - r.width / 2); // throw away from the button's centre
  for (let i = 0; i < 11; i++) {
    const a = base + rand(-1.5, 1.5);
    const dist = rand(14, 46);
    const size = rand(1.4, 4.2);
    const streak = Math.random() < 0.35;
    const el = document.createElementNS(NS, 'ellipse');
    el.setAttribute('rx', String(streak ? size * 2.6 : size));
    el.setAttribute('ry', String(size));
    el.setAttribute('fill', color);
    layer.appendChild(el);
    const deg = (a * 180) / Math.PI;
    el.animate(
      [
        { transform: `rotate(${deg}deg) translate(0px) scale(.3)`, opacity: 1 },
        { transform: `rotate(${deg}deg) translate(${dist * 0.8}px) scale(1)`, opacity: 1, offset: 0.35 },
        {
          transform: `rotate(${deg}deg) translate(${dist}px) scale(${streak ? '.55, .9' : '.9'})`,
          opacity: 0.9,
          offset: 0.6,
        },
        { transform: `rotate(${deg}deg) translate(${dist}px) scale(.2)`, opacity: 0 },
      ],
      { duration: rand(650, 950), delay: rand(0, 60), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' },
    );
  }
  setTimeout(() => layer.remove(), 1100);
  b.classList.add('inked');
}

function dry(b: HTMLElement): void {
  b.classList.remove('inked');
  for (const s of b.querySelectorAll('.inkb')) {
    s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease-out', fill: 'forwards' }).onfinish =
      () => s.remove();
  }
}

export function initInk(root: Document = document): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.addEventListener('pointerover', (e) => {
    const b = (e.target as Element | null)?.closest?.<HTMLElement>('.btn');
    if (b && !b.contains(e.relatedTarget as Node | null)) spread(b, e);
  });
  root.addEventListener('pointerout', (e) => {
    const b = (e.target as Element | null)?.closest?.<HTMLElement>('.btn');
    if (b && !b.contains(e.relatedTarget as Node | null)) dry(b);
  });
}
