// Sparkles: the little doodles artists sprinkle around their work. Decorative only.
// Static ones are declared in HTML: data-spk="shape colour size side:offset side:offset; ..." on an element,
// sizes and offsets in em of that element, e.g. data-spk="star8 az .55 left:-.85 top:-.25; dot si .14 right:-.4 top:-.4".
// Colours: si (sienna), az (azure), ink. `burst(x, y)` throws a mix of them around a point; nothing moves for
// visitors who prefer less motion.
const STAR =
  'M12 1.5C12.8 7.5 16.5 11.2 22.5 12 16.5 12.8 12.8 16.5 12 22.5 11.2 16.5 7.5 12.8 1.5 12 7.5 11.2 11.2 7.5 12 1.5Z';
const line = 'fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"';
const SHAPES: Record<string, string> = {
  star4: `<path d="${STAR}" ${line}/>`,
  star4f: `<path d="${STAR}" fill="currentColor"/>`,
  star8: `<path d="${STAR}" fill="currentColor"/><path d="${STAR}" fill="currentColor" transform="translate(12 12) rotate(45) scale(.5) translate(-12 -12)"/>`,
  cross: `<path d="M12 4v16M4 12h16" ${line} stroke-width="3"/>`,
  dot: `<circle cx="12" cy="12" r="5" fill="currentColor"/>`,
  ring: `<circle cx="12" cy="12" r="6.5" ${line} stroke-width="3"/>`,
  shine: `<path d="M14 3.5 13 9M20.5 10l-5.2 1.6M19.5 4.5l-4 4" ${line} stroke-width="2.6"/>`,
};
const MOTION: Record<string, string> = {
  star4: 'tw',
  star4f: 'tw',
  star8: 'spin',
  cross: 'pulse',
  dot: 'pop',
  ring: 'pop',
  shine: 'pulse',
};
const COLOURS = new Set(['si', 'az', 'ink']);
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function svgElement(markup: string): SVGSVGElement {
  const t = document.createElement('template');
  t.innerHTML = markup;
  return t.content.firstChild as SVGSVGElement;
}

export function decorate(root: ParentNode = document): void {
  let k = 0;
  for (const host of root.querySelectorAll<HTMLElement>('[data-spk]')) {
    host.classList.add('spk-host');
    for (const spec of (host.dataset.spk ?? '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)) {
      const [shape, colour, size, ...pos] = spec.split(/\s+/);
      if (!SHAPES[shape]) continue;
      const el = svgElement(
        `<svg class="spk ${MOTION[shape]}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${SHAPES[shape]}</svg>`,
      );
      el.classList.add(COLOURS.has(colour) ? colour : 'si');
      el.style.setProperty('--s', `${size}em`);
      for (const p of pos) {
        const [side, v] = p.split(':');
        el.style.setProperty(side, `${v}em`);
      }
      el.style.animationDelay = `${-(k++ * 0.73) % 4}s`;
      host.appendChild(el);
    }
  }
}

export function burst(x: number, y: number, n = 11, spread = 70): void {
  if (still()) return;
  const kinds = ['star4', 'star4f', 'star8', 'star4f', 'cross', 'dot', 'ring', 'star4'];
  for (let i = 0; i < n; i++) {
    const shape = kinds[(i + Math.floor(Math.random() * kinds.length)) % kinds.length];
    const small = shape === 'dot' || shape === 'ring' || shape === 'cross';
    const size = small ? 10 + Math.random() * 8 : 20 + Math.random() * 18;
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
    const d = spread * (0.75 + Math.random() * 0.45);
    const d0 = spread * 0.3;
    const s = svgElement(
      `<svg class="spk-burst ${i % 3 === 1 ? 'az' : 'si'}" viewBox="0 0 24 24" aria-hidden="true">${SHAPES[shape]}</svg>`,
    );
    Object.assign(s.style, {
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
    });
    document.body.appendChild(s);
    const r0 = Math.random() * 40 - 20;
    s.animate(
      [
        { transform: `translate(${Math.cos(a) * d0}px, ${Math.sin(a) * d0}px) scale(.2) rotate(${r0}deg)`, opacity: 0 },
        {
          transform: `translate(${Math.cos(a) * d * 0.8}px, ${Math.sin(a) * d * 0.8}px) scale(1.15) rotate(${r0 + 25}deg)`,
          opacity: 1,
          offset: 0.38,
        },
        {
          transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(1) rotate(${r0 + 40}deg)`,
          opacity: 1,
          offset: 0.7,
        },
        {
          transform: `translate(${Math.cos(a) * d * 1.06}px, ${Math.sin(a) * d * 1.06}px) scale(.3) rotate(${r0 + 60}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1150 + Math.random() * 350, delay: i * 28, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' },
    ).onfinish = () => s.remove();
  }
}
