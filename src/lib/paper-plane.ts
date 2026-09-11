/**
 * Folds a sheet of paper into a plane and flies it away, in real 3D.
 *
 * Every fold clones the sheet's current look, cuts it along the crease and
 * rotates it about that crease with perspective, so what you see is one
 * piece of paper being folded, not a swap to a drawing of a plane. The
 * landed flap becomes part of the sheet for the next fold. GSAP is loaded
 * on demand so the index never pays for it.
 */

type Pt = { x: number; y: number };
type Crease = [Pt, Pt];

export type FoldOptions = {
  /** Skip the folds and flight; just resolve. */
  reduceMotion?: boolean;
  /** Called as phases start: "fold", "open", "fly". */
  onPhase?: (phase: "fold" | "open" | "fly") => void;
};

const PAPER_BACK = "#f4efe4";

const px = (n: number) => `${n.toFixed(2)}px`;
const polygon = (pts: Pt[]) => `polygon(${pts.map((p) => `${px(p.x)} ${px(p.y)}`).join(", ")})`;

/** Mirror a point across the line through a and b. */
function reflect(p: Pt, [a, b]: Crease): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  const fx = a.x + t * dx;
  const fy = a.y + t * dy;
  return { x: 2 * fx - p.x, y: 2 * fy - p.y };
}

/** Signed side of p relative to the directed line a→b (screen coordinates). */
const side = (p: Pt, [a, b]: Crease) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

/** Sutherland–Hodgman: the part of `poly` on the chosen side of the crease. */
function clipToSide(poly: Pt[], crease: Crease, keep: "positive" | "negative"): Pt[] {
  const inside = (p: Pt) => (keep === "positive" ? side(p, crease) >= 0 : side(p, crease) <= 0);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn !== prevIn) {
      const sp = side(prev, crease);
      const sc = side(cur, crease);
      const t = sp / (sp - sc);
      out.push({ x: prev.x + (cur.x - prev.x) * t, y: prev.y + (cur.y - prev.y) * t });
    }
    if (curIn) out.push(cur);
  }
  return out;
}

function el(className: string, style: Partial<CSSStyleDeclaration> = {}) {
  const node = document.createElement("div");
  node.className = className;
  Object.assign(node.style, style);
  return node;
}

export async function foldAndFly(stage: HTMLElement, sheet: HTMLElement, { reduceMotion, onPhase }: FoldOptions = {}) {
  const [{ gsap }, { MotionPathPlugin }, { DrawSVGPlugin }] = await Promise.all([
    import("gsap"),
    import("gsap/MotionPathPlugin"),
    import("gsap/DrawSVGPlugin"),
  ]);
  gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin);

  if (reduceMotion) {
    await gsap.to(sheet, { opacity: 0, duration: 0.3 });
    return;
  }

  const W = sheet.offsetWidth;
  const H = sheet.offsetHeight;
  const spineX = W / 2;

  // The plane is everything that flies; the stack is the folded paper so far.
  const plane = el("absolute inset-0", { transformStyle: "preserve-3d", transformOrigin: `${px(spineX)} ${px(H * 0.45)}` });
  plane.dataset.part = "plane";
  const stack = el("absolute inset-0", { transformStyle: "preserve-3d" });
  stack.dataset.part = "stack";
  const base = sheet.cloneNode(true) as HTMLElement;
  base.removeAttribute("data-part");
  base.style.position = "absolute";
  base.style.inset = "0";
  base.style.visibility = "visible";
  stack.appendChild(base);
  plane.appendChild(stack);
  stage.appendChild(plane);
  // From here the clones carry the picture; the real sheet steps aside.
  sheet.style.visibility = "hidden";

  let silhouette: Pt[] = [
    { x: 0, y: 0 },
    { x: W, y: 0 },
    { x: W, y: H },
    { x: 0, y: H },
  ];

  /**
   * Fold the part of the paper containing `inside` over the crease onto the
   * other side. The flap lifts towards the viewer and lands face-down.
   */
  async function fold(crease: Crease, inside: Pt, duration: number) {
    const foldSide: "positive" | "negative" = side(inside, crease) >= 0 ? "positive" : "negative";
    const region = clipToSide(silhouette, crease, foldSide);
    if (region.length < 3) return;
    const landed = region.map((p) => reflect(p, crease));
    const [a, b] = crease;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const axis = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
    // Right-hand rule in screen space: pick the sign that lifts the flap towards the viewer.
    const probe = region.reduce((acc, p) => ({ x: acc.x + p.x / region.length, y: acc.y + p.y / region.length }), { x: 0, y: 0 });
    const rx = probe.x - a.x;
    const ry = probe.y - a.y;
    const lift = axis.x * ry - axis.y * rx;
    const sign = lift > 0 ? 1 : -1;
    const origin = `${px(a.x)} ${px(a.y)}`;
    const rotate = (deg: number) => `rotate3d(${axis.x.toFixed(4)}, ${axis.y.toFixed(4)}, 0, ${(sign * deg).toFixed(2)}deg)`;

    const flap = el("absolute inset-0", { transformStyle: "preserve-3d", transformOrigin: origin, transform: rotate(0) });
    flap.dataset.fold = "";
    const front = stack.cloneNode(true) as HTMLElement;
    front.removeAttribute("data-part");
    Object.assign(front.style, { clipPath: polygon(region), backfaceVisibility: "hidden", transformStyle: "flat" });
    const frontShade = el("absolute inset-0", { background: "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05))", opacity: "0" });
    front.appendChild(frontShade);
    const back = el("absolute inset-0 paper", {
      clipPath: polygon(landed),
      backfaceVisibility: "hidden",
      backgroundColor: PAPER_BACK,
      transformOrigin: origin,
      transform: rotate(180),
    });
    const backShade = el("absolute inset-0", { background: "linear-gradient(315deg, rgba(0,0,0,0.3), rgba(0,0,0,0.02))", opacity: "0.35" });
    back.appendChild(backShade);
    flap.append(front, back);
    plane.appendChild(flap);

    // The sheet loses that region the instant the flap lifts; the flap covers the seam.
    silhouette = clipToSide(silhouette, crease, foldSide === "positive" ? "negative" : "positive");
    stack.style.clipPath = polygon(silhouette);

    const angle = { deg: 0 };
    await gsap.to(angle, {
      deg: 180,
      duration,
      ease: "power2.inOut",
      onUpdate() {
        flap.style.transform = rotate(angle.deg);
        const t = angle.deg / 180;
        frontShade.style.opacity = String(Math.min(0.45, t * 0.9));
        backShade.style.opacity = String(0.35 * (1 - t) + 0.06);
      },
    });

    // Landed: it is now a flat layer of the sheet, showing paper's back.
    const layer = el("absolute inset-0 paper", { clipPath: polygon(landed), backgroundColor: PAPER_BACK });
    layer.appendChild(el("absolute inset-0", { background: "linear-gradient(315deg, rgba(0,0,0,0.12), rgba(0,0,0,0))" }));
    stack.appendChild(layer);
    flap.remove();
  }

  onPhase?.("fold");
  const tip: Pt = { x: spineX, y: 0 };
  // 1. In half, along the spine. The right half comes over the left.
  await fold([tip, { x: spineX, y: H }], { x: W, y: H / 2 }, 0.65);
  await gsap.to({}, { duration: 0.06 });
  // 2. The outer top corner to the spine: the nose starts.
  await fold([tip, { x: 0, y: spineX }], { x: 0, y: 0 }, 0.55);
  await gsap.to({}, { duration: 0.06 });
  // 3. The new slanted edge to the spine: a dart.
  await fold([tip, { x: 0, y: H * 0.82 }], { x: 0, y: H * 0.5 }, 0.55);
  await gsap.to({}, { duration: 0.08 });

  // 4. Open: the folded half swings out as the other wing; both rise to a dihedral.
  onPhase?.("open");
  const hinge = el("absolute inset-0", { transformStyle: "preserve-3d", transformOrigin: `${px(spineX)} 50%`, transform: "rotateY(180deg)" });
  const wing = stack.cloneNode(true) as HTMLElement;
  wing.removeAttribute("data-part");
  Object.assign(wing.style, { transformOrigin: `${px(spineX)} 50%`, transform: "scaleX(-1)", backfaceVisibility: "hidden" });
  // The far wing turns away from the light.
  wing.appendChild(el("absolute inset-0", { background: "linear-gradient(90deg, rgba(0,0,0,0.16), rgba(0,0,0,0.04))", clipPath: polygon(silhouette) }));
  hinge.appendChild(wing);
  plane.insertBefore(hinge, stack);
  stack.style.transformOrigin = `${px(spineX)} 50%`;
  await Promise.all([
    gsap.to(hinge, { rotateY: 34, duration: 0.7, ease: "power3.out" }),
    gsap.to(stack, { rotateY: -34, duration: 0.7, ease: "power3.out" }),
    gsap.to(plane, { rotateX: 52, rotateZ: -12, duration: 0.7, ease: "power3.out" }),
  ]);

  // 5. Fly, nose first, along a curve that leaves the screen top-right.
  onPhase?.("fly");
  const path = [
    { x: 0, y: 0 },
    { x: 70, y: -70 },
    { x: 220, y: -300 },
    { x: 560, y: -520 },
    { x: 980, y: -640 },
  ];
  const trail = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  trail.setAttribute("aria-hidden", "true");
  Object.assign(trail.style, { position: "absolute", left: px(spineX), top: px(H * 0.45), width: "1px", height: "1px", overflow: "visible", pointerEvents: "none" });
  const trailPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  trailPath.setAttribute("d", MotionPathPlugin.arrayToRawPath(path, { curviness: 1.2 }).map((seg: number[]) => `M${seg[0]},${seg[1]}C${seg.slice(2).join(",")}`).join(" "));
  Object.assign(trailPath.style, { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeDasharray: "5 8", strokeLinecap: "round", opacity: "0.75" });
  trail.appendChild(trailPath);
  trail.dataset.part = "trail";
  stage.appendChild(trail);
  gsap.set(trailPath, { drawSVG: "0%" });

  const tl = gsap.timeline();
  tl.to(plane, {
    duration: 1.5,
    ease: "power2.in",
    motionPath: { path, curviness: 1.2, autoRotate: 90 },
    scale: 0.22,
  }, 0)
    .to(plane, { rotateX: 35, rotateZ: -30, duration: 1.5, ease: "sine.inOut" }, 0)
    .to(plane, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.15)
    .to(trailPath, { drawSVG: "100%", duration: 1.5, ease: "power2.in" }, 0)
    .to(trailPath, { opacity: 0, duration: 0.4 }, 1.25);
  await tl;
}
