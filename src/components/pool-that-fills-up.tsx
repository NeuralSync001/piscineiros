"use client";

/*
  Adapted from “The Pool That Fills Up” by Animorio.
  Licensed for use in this project, including commercial projects. Do not resell or redistribute the animation.
  The original GSAP and ScrollTrigger components remain subject to their own license.
  https://animorio.com/en/animations/pool-that-fills-up/
*/

import { ArrowDown, ArrowUpRight, Waves } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Point3D = readonly [x: number, y: number, z: number];
type ProjectedPoint = { x: number; y: number; k: number };

export function PoolThatFillsUp() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLParagraphElement>(null);
  const levelRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const title = titleRef.current;
    const titleText = titleTextRef.current;
    const level = levelRef.current;
    const note = noteRef.current;
    const cue = cueRef.current;
    const context2d = canvas?.getContext("2d");

    if (!section || !track || !stage || !canvas || !title || !titleText || !level || !note || !cue) {
      console.error("AquaZen pool animation could not initialize because its canvas elements are missing.");
      return;
    }

    if (!context2d) {
      console.error("AquaZen pool animation could not initialize because Canvas 2D is unavailable.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const DEPTH = 2.4;
    const LANES = 4;
    const LINES = 34;
    const RIPPLE = 1;
    const BOB = 1;
    const SMOOTH = 5;
    const RIDE = 0.35;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionPreference.matches;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;
    const phase = (value: number, start: number, end: number) => clamp((value - start) / (end - start), 0, 1);
    const easeInOut = gsap.parseEase("power2.inOut");

    const width = 12;
    const length = 11;
    const depth = 2.6;
    const camera = { y: 13, z: 1.2, pitch: 1.1 };
    const cosine = Math.cos(camera.pitch);
    const sine = Math.sin(camera.pitch);
    const progressState = { value: 0, target: 0, fill: 0, velocity: 0, time: 0 };
    const view = {
      width: 1,
      height: 1,
      dpr: 1,
      focalLength: 1,
      originX: 0,
      originY: 0,
      lineCount: LINES,
      colors: {
        ink: "#EAF2F7",
        faint: "#A7C0D2",
        water: "#12BDEB",
      },
    };

    const projectPoint = (x: number, y: number, z: number): ProjectedPoint => {
      const dy = y - camera.y;
      const dz = z - camera.z;
      const cameraY = dy * cosine + dz * sine;
      const cameraZ = -dy * sine + dz * cosine;
      return {
        x: view.originX + (x / cameraZ) * view.focalLength,
        y: view.originY - (cameraY / cameraZ) * view.focalLength,
        k: view.focalLength / cameraZ,
      };
    };

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      view.width = Math.max(1, rect.width);
      view.height = Math.max(1, rect.height);
      view.dpr = Math.min(window.devicePixelRatio || 1, view.width < 761 ? 1.5 : 2);

      canvas.width = Math.round(view.width * view.dpr);
      canvas.height = Math.round(view.height * view.dpr);

      const style = getComputedStyle(section);
      view.colors.ink = style.getPropertyValue("--pool-ink").trim() || "#EAF2F7";
      view.colors.faint = style.getPropertyValue("--pool-muted").trim() || "#A7C0D2";
      view.colors.water = style.getPropertyValue("--pool-water").trim() || "#12BDEB";

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const x of [-width / 2, width / 2]) {
        for (const y of [0, -depth]) {
          for (const z of [0, length]) {
            const pointY = y - camera.y;
            const pointZ = z - camera.z;
            const projectedY = -(pointY * cosine + pointZ * sine) / (-pointY * sine + pointZ * cosine);
            const projectedX = x / (-pointY * sine + pointZ * cosine);

            minX = Math.min(minX, projectedX);
            maxX = Math.max(maxX, projectedX);
            minY = Math.min(minY, projectedY);
            maxY = Math.max(maxY, projectedY);
          }
        }
      }

      const topSpace = clamp(view.height * (view.width < 560 ? 0.44 : 0.38), 250, 350);
      const bottomSpace = clamp(view.height * 0.1, 40, 70);
      const availableWidth = view.width * (view.width < 560 ? 0.9 : 0.8);
      const availableHeight = Math.max(1, view.height - topSpace - bottomSpace);

      view.focalLength = Math.min(
        availableWidth / (maxX - minX),
        availableHeight / (maxY - minY),
      );
      view.originX = view.width / 2 - ((minX + maxX) / 2) * view.focalLength;
      view.originY = topSpace + availableHeight / 2 - ((minY + maxY) / 2) * view.focalLength;
      view.lineCount = Math.round(LINES * clamp(view.width / 1100, 0.55, 1));
      track.style.height = `${Math.round(320 * RIDE + 100)}lvh`;
    };

    const drawLine = (points: ProjectedPoint[]) => {
      context2d.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context2d.moveTo(point.x, point.y);
        else context2d.lineTo(point.x, point.y);
      });
      context2d.stroke();
    };

    const drawSegment = (start: Point3D, end: Point3D, steps = 1) => {
      const points: ProjectedPoint[] = [];

      for (let index = 0; index <= steps; index++) {
        const progress = index / steps;
        points.push(
          projectPoint(
            lerp(start[0], end[0], progress),
            lerp(start[1], end[1], progress),
            lerp(start[2], end[2], progress),
          ),
        );
      }

      drawLine(points);
    };

    const wave = (x: number, z: number, amplitude: number) =>
      amplitude *
      0.5 *
      (Math.sin(x * 1.25 + progressState.time * 1.1 + z * 0.35) +
        0.65 * Math.sin(z * 1.6 - progressState.time * 1.5 + x * 0.2));

    const drawPool = () => {
      const ctx = context2d;
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
      ctx.clearRect(0, 0, view.width, view.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const rim = [
        projectPoint(-width / 2, 0, 0),
        projectPoint(-width / 2, 0, length),
        projectPoint(width / 2, 0, length),
        projectPoint(width / 2, 0, 0),
      ];

      ctx.save();
      ctx.beginPath();
      rim.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.clip();

      const floor = [
        projectPoint(-width / 2, -depth, 0),
        projectPoint(-width / 2, -depth, length),
        projectPoint(width / 2, -depth, length),
        projectPoint(width / 2, -depth, 0),
      ];
      const depthGradient = ctx.createLinearGradient(
        view.originX,
        view.originY + view.height * 0.3,
        view.originX,
        view.originY + view.height,
      );
      depthGradient.addColorStop(0, "rgba(18, 189, 235, 0.025)");
      depthGradient.addColorStop(0.58, "rgba(18, 189, 235, 0.075)");
      depthGradient.addColorStop(1, "rgba(3, 14, 29, 0.2)");
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = depthGradient;
      ctx.beginPath();
      floor.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fill();

      const fill = progressState.fill;
      const waterHeight = -depth + fill * (depth - 0.18);
      const amplitude =
        reducedMotion || fill <= 0.001
          ? 0
          : (0.035 + Math.min(progressState.velocity, 1.4) * 0.22) * RIPPLE;

      ctx.lineWidth = 1;
      ctx.strokeStyle = view.colors.ink;
      const tremor = (x: number, z: number) =>
        fill > 0.001 && !reducedMotion
          ? Math.sin(z * 2.1 + progressState.time * 2) * 0.06 * Math.min(1, amplitude * 6)
          : 0;

      ctx.globalAlpha = lerp(0.13, 0.06, fill);
      for (let z = 1; z < length; z += 1) {
        drawSegment([-width / 2, -depth, z], [width / 2, -depth, z]);
      }
      for (let x = -width / 2 + 1; x < width / 2; x += 1) {
        drawSegment([x, -depth, 0], [x, -depth, length]);
      }

      const laneCount = Math.max(2, LANES);
      for (let lane = 1; lane <= laneCount; lane++) {
        const x = -width / 2 + (lane - 0.5) * (width / laneCount);
        const points: ProjectedPoint[] = [];

        for (let index = 0; index <= 24; index++) {
          const z = lerp(1.4, length - 1.4, index / 24);
          points.push(projectPoint(x + tremor(x, z), -depth, z));
        }

        ctx.globalAlpha = lerp(0.8, 0.55, fill);
        ctx.strokeStyle = fill > 0.02 ? view.colors.water : view.colors.ink;
        ctx.lineWidth = 2;
        drawLine(points);
        ctx.lineWidth = 1.4;
        drawSegment([x - 0.35, -depth, 1.4], [x + 0.35, -depth, 1.4]);
        drawSegment([x - 0.35, -depth, length - 1.4], [x + 0.35, -depth, length - 1.4]);
      }

      ctx.strokeStyle = view.colors.ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.1;
      for (let y = -depth + 0.5; y < 0; y += 0.5) {
        drawSegment([-width / 2, y, 0], [-width / 2, y, length]);
        drawSegment([width / 2, y, 0], [width / 2, y, length]);
        drawSegment([-width / 2, y, length], [width / 2, y, length]);
      }

      ctx.globalAlpha = lerp(0.85, 0.3, fill);
      drawLine([
        projectPoint(-width / 2, -depth, 0),
        projectPoint(-width / 2, -depth, length),
        projectPoint(width / 2, -depth, length),
        projectPoint(width / 2, -depth, 0),
      ]);
      for (const [x, z] of [
        [-width / 2, length],
        [width / 2, length],
        [-width / 2, 0],
        [width / 2, 0],
      ] as const) {
        drawSegment([x, 0, z], [x, -depth, z]);
      }
      drawSegment([-width / 2, -depth, 0], [width / 2, -depth, 0]);

      if (fill > 0.002) {
        const edge: ProjectedPoint[] = [];
        const edgeSteps = 28;

        for (let index = 0; index <= edgeSteps; index++) {
          const z = (length * index) / edgeSteps;
          edge.push(projectPoint(-width / 2, waterHeight + wave(-width / 2, z, amplitude), z));
        }
        for (let index = 0; index <= edgeSteps; index++) {
          const x = -width / 2 + (width * index) / edgeSteps;
          edge.push(projectPoint(x, waterHeight + wave(x, length, amplitude), length));
        }
        for (let index = edgeSteps; index >= 0; index--) {
          const z = (length * index) / edgeSteps;
          edge.push(projectPoint(width / 2, waterHeight + wave(width / 2, z, amplitude), z));
        }
        for (let index = edgeSteps; index >= 0; index--) {
          const x = -width / 2 + (width * index) / edgeSteps;
          edge.push(projectPoint(x, waterHeight + wave(x, 0, amplitude), 0));
        }

        ctx.beginPath();
        edge.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        const waterGradient = ctx.createLinearGradient(
          view.originX,
          view.originY + view.height * 0.47,
          view.originX,
          view.originY + view.height,
        );
        waterGradient.addColorStop(0, "rgba(114, 240, 255, 0.2)");
        waterGradient.addColorStop(0.54, "rgba(18, 189, 235, 0.1)");
        waterGradient.addColorStop(1, "rgba(7, 26, 50, 0.18)");
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = waterGradient;
        ctx.fill();

        ctx.strokeStyle = view.colors.water;
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1.4;
        drawLine(edge);

        ctx.strokeStyle = "#d9fbff";
        ctx.lineWidth = 1;
        for (let reflection = 0; reflection < 3; reflection++) {
          const z =
            length * (0.22 + reflection * 0.25) +
            Math.sin(progressState.time * 0.32 + reflection) * 0.16;
          ctx.globalAlpha =
            0.07 + (0.05 * (1 + Math.sin(progressState.time * 0.48 + reflection))) / 2;
          ctx.beginPath();

          for (let index = 0; index <= 10; index++) {
            const x = lerp(-width * 0.3, width * 0.3, index / 10);
            const point = projectPoint(x, waterHeight + wave(x, z, amplitude) + 0.012, z);
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          }

          ctx.stroke();
        }

        for (let row = 1; row < view.lineCount; row++) {
          const z = (length * row) / view.lineCount;
          const points: ProjectedPoint[] = [];

          for (let index = 0; index <= 30; index++) {
            const x = -width / 2 + (width * index) / 30;
            points.push(projectPoint(x, waterHeight + wave(x, z, amplitude), z));
          }

          ctx.globalAlpha = lerp(0.75, 0.22, row / view.lineCount);
          ctx.lineWidth = lerp(1.2, 0.7, row / view.lineCount);
          drawLine(points);
        }
      }

      ctx.restore();
      ctx.strokeStyle = view.colors.ink;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.5;
      drawLine([...rim, rim[0]]);
      ctx.globalAlpha = 1;

      return waterHeight;
    };

    const updateLabels = (waterHeight: number) => {
      const fill = progressState.fill;
      const titleZ = length * 0.42;
      const bob =
        reducedMotion || fill < 0.01
          ? 0
          : (Math.sin(progressState.time * 1.35) * 0.06 + wave(0, titleZ, 0.04)) *
            BOB *
            Math.min(1, fill * 4);
      const titleY = Math.max(-depth + 0.02, waterHeight) + bob;
      const projectedTitle = projectPoint(0, titleY, titleZ);
      const fontWeight = lerp(220, 700, easeInOut(fill));
      const fontStretch = lerp(118, 90, easeInOut(fill));

      titleText.style.fontWeight = fontWeight.toFixed(0);
      titleText.style.fontStretch = `${fontStretch.toFixed(1)}%`;

      const titleWidth = titleText.offsetWidth || 1;
      const poolWidth =
        projectPoint(width / 2, titleY, titleZ).x - projectPoint(-width / 2, titleY, titleZ).x;
      const scale = Math.min(
        projectedTitle.k / projectPoint(0, 0, titleZ).k,
        (poolWidth * 0.78) / titleWidth,
      );
      const rotation =
        reducedMotion || fill < 0.01
          ? 0
          : Math.sin(progressState.time * 0.9 + 0.6) * 1.4 * BOB * Math.min(1, fill * 4);

      gsap.set(title, {
        x: projectedTitle.x,
        y: projectedTitle.y,
        scale,
        rotation,
        force3D: true,
      });

      titleText.style.color = fill > 0.002 ? view.colors.ink : view.colors.faint;
      titleText.style.opacity = (0.55 + 0.45 * phase(fill, 0, 0.25)).toFixed(3);
      level.textContent = `${(fill * DEPTH).toFixed(2)} m`;
      note.style.opacity = phase(progressState.value, 0.88, 0.97).toFixed(3);
      cue.style.opacity = (1 - phase(progressState.value, 0.02, 0.08)).toFixed(3);
    };

    const renderFrame = (delta: number) => {
      if (reducedMotion) {
        progressState.value = progressState.target;
      } else {
        const smoothing = 1 - Math.exp(-SMOOTH * delta);
        progressState.value += (progressState.target - progressState.value) * smoothing;
        progressState.time += delta;
      }

      const previousFill = progressState.fill;
      progressState.fill = easeInOut(phase(progressState.value, 0.08, 0.86));

      const velocity = delta > 0 ? Math.abs(progressState.fill - previousFill) / delta : 0;
      progressState.velocity +=
        (velocity * 6 - progressState.velocity) *
        (1 - Math.exp(-(velocity * 6 > progressState.velocity ? 6 : 1.2) * delta));

      updateLabels(drawPool());
    };

    let active = true;
    let stageVisible = false;
    let resizeCall: gsap.core.Tween | undefined;
    let scrollTrigger: ScrollTrigger | undefined;
    let context: gsap.Context | undefined;
    let stageObserver: IntersectionObserver | undefined;

    const ticker = (_time: number, deltaTime: number) => {
      if (!active) return;
      renderFrame(Math.min(deltaTime / 1000, 1 / 20));
    };

    const syncTicker = () => {
      gsap.ticker.remove(ticker);
      if (active && stageVisible && !reducedMotion) gsap.ticker.add(ticker);
    };

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) progressState.time = 0;
      syncTicker();
      renderFrame(0);
    };

    const handleResize = () => {
      resizeCall?.kill();
      resizeCall = gsap.delayedCall(0.12, () => {
        if (!active) return;
        measure();

        ScrollTrigger.refresh();
      });
    };

    context = gsap.context(() => {
      measure();

      scrollTrigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (instance) => {
          progressState.target = instance.progress;
          if (reducedMotion) {
            progressState.value = progressState.target;
            renderFrame(0);
          }
        },
        onRefresh: (instance) => {
          progressState.target = instance.progress;
          if (reducedMotion) {
            progressState.value = progressState.target;
            renderFrame(0);
          }
        },
      });

      ScrollTrigger.refresh();
      progressState.value = progressState.target;

      renderFrame(0);

      if (!reducedMotion) {
        const entrance = gsap.timeline({ defaults: { ease: "power2.out" } });
        entrance
          .fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0)
          .fromTo(
            ".pool-heading__eyebrow",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.55 },
            0.22,
          )
          .fromTo(
            ".pool-heading h1",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7 },
            0.36,
          )
          .fromTo(
            ".pool-heading__description",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.56,
          )
          .fromTo(
            ".pool-heading__actions",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6 },
            0.74,
          );
        gsap.from([title, level.parentElement ?? level, cue], {
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
        });
      }
    }, section);

    if ("IntersectionObserver" in window) {
      stageObserver = new IntersectionObserver(([entry]) => {
        stageVisible = entry.isIntersecting;
        if (stageVisible) {
          progressState.target = scrollTrigger?.progress ?? progressState.target;
          progressState.value = progressState.target;
          renderFrame(0);
        }
        syncTicker();
      });
      stageObserver.observe(stage);
    } else {
      stageVisible = true;
      syncTicker();
    }

    window.addEventListener("resize", handleResize, { passive: true });
    motionPreference.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      active = false;
      window.removeEventListener("resize", handleResize);
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);
      stageObserver?.disconnect();
      resizeCall?.kill();
      gsap.ticker.remove(ticker);
      scrollTrigger?.kill();
      context?.revert();
      track.style.removeProperty("height");
    };
  }, []);

  return (
    <section
      aria-labelledby="pool-section-title"
      className="pool-experience"
      id="inicio"
      ref={sectionRef}
    >
      <div className="pool-run" ref={trackRef}>
        <div className="pool-stage" ref={stageRef}>
          <canvas aria-hidden="true" className="pool-canvas" ref={canvasRef} />

          <div className="pool-header">
            <p className="pool-header__note">
              <Waves aria-hidden="true" size={14} /> EQUILÍBRIO EM CADA ONDA
            </p>
          </div>

          <div className="pool-heading">
            <p className="pool-heading__eyebrow">A EXPERIÊNCIA DA ÁGUA</p>
            <h1 id="pool-section-title">
              A água transforma <span>tudo.</span>
            </h1>
            <p className="pool-heading__description">
              Cuidado, equilíbrio e qualidade em cada detalhe.
            </p>
            <div className="pool-heading__actions">
              <a className="button button--primary" href="#contato">
                Solicitar orçamento <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              <a className="pool-heading__link" href="#servicos">
                Conheça nossos serviços <ArrowDown aria-hidden="true" size={15} />
              </a>
            </div>
          </div>

          <div aria-hidden="true" className="pool-floating-title" ref={titleRef}>
            <p className="pool-floating-title__text" ref={titleTextRef}>
              A água transforma tudo.
            </p>
          </div>

          <p className="pool-level">
            <span className="pool-level__label">NÍVEL DEMONSTRATIVO</span>
            <span className="pool-level__value" ref={levelRef}>0.00 m</span>
          </p>

          <p className="pool-note" ref={noteRef}>
            Sua piscina em perfeito equilíbrio.
          </p>

          <p className="pool-cue" ref={cueRef}>
            <span role="presentation">Role para encher</span>
            <ArrowDown aria-hidden="true" size={14} />
          </p>

          <p className="sr-only">
            Animação de uma piscina ilustrativa que enche ao rolar a página para baixo e esvazia ao rolar para cima.
            O nível indicado é apenas demonstrativo.
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="pool-transition" />
    </section>
  );
}
