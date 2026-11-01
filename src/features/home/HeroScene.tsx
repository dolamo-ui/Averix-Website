'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/motion';

/** The floating wireframe artefact behind the hero text (Three.js, desktop + WebGL only). */
export default function HeroScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const cv = canvas.current;
    const hero = cv?.closest('section');
    if (!cv || !hero) return;

    const webgl = (() => {
      try {
        return !!document.createElement('canvas').getContext('webgl');
      } catch {
        return false;
      }
    })();
    if (prefersReducedMotion() || window.innerWidth <= 760 || !webgl) {
      setDisabled(true);
      return;
    }

    let disposed = false;
    let frame = 0;
    const cleanups: Array<() => void> = [];

    // three.js is only downloaded when the scene will actually run.
    import('three').then((T) => {
      if (disposed) return;
      const renderer = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 7;

      const group = new T.Group();
      scene.add(group);
      const core = new T.Mesh(
        new T.OctahedronGeometry(1.5, 0),
        new T.MeshStandardMaterial({ color: 0x0c0e18, metalness: 0.9, roughness: 0.25, flatShading: true }),
      );
      const wire = new T.LineSegments(
        new T.EdgesGeometry(new T.OctahedronGeometry(2.2, 0)),
        new T.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 }),
      );
      const wire2 = new T.LineSegments(
        new T.EdgesGeometry(new T.OctahedronGeometry(2.9, 1)),
        new T.LineBasicMaterial({ color: 0x7b34ff, transparent: true, opacity: 0.35 }),
      );
      group.add(core, wire, wire2);

      const count = 500;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 14;
      const starGeo = new T.BufferGeometry();
      starGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
      const stars = new T.Points(
        starGeo,
        new T.PointsMaterial({ color: 0x9fe9ff, size: 0.025, transparent: true, opacity: 0.7 }),
      );
      scene.add(stars);

      const l1 = new T.PointLight(0x00e5ff, 60, 20);
      l1.position.set(-4, 3, 4);
      const l2 = new T.PointLight(0x7b34ff, 80, 20);
      l2.position.set(4, -2, 3);
      scene.add(l1, l2, new T.AmbientLight(0x222244, 0.8));

      group.position.x = -0.4;
      group.scale.setScalar(0);
      gsap.to(group.scale, { x: 0.55, y: 0.55, z: 0.55, duration: 2, delay: 1.2, ease: 'power3.out' });

      const resize = () => {
        const w = cv.clientWidth;
        const h = cv.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      let mx = 0;
      let my = 0;
      const onMove = (e: PointerEvent) => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let onScreen = true;
      const io = new IntersectionObserver((e) => (onScreen = e[0].isIntersecting));
      io.observe(hero);

      const clock = new T.Clock();
      const loop = () => {
        frame = requestAnimationFrame(loop);
        if (!onScreen) return;
        const t = clock.getElapsedTime();
        core.rotation.y = t * 0.25;
        core.rotation.x = t * 0.12;
        wire.rotation.y = -t * 0.18;
        wire.rotation.z = t * 0.1;
        wire2.rotation.y = t * 0.07;
        stars.rotation.y = t * 0.02;
        group.rotation.y += (mx * 0.5 - group.rotation.y) * 0.04;
        group.rotation.x += (my * 0.4 - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
      };
      loop();

      cleanups.push(() => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        io.disconnect();
        gsap.killTweensOf(group.scale);
        [core.geometry, wire.geometry, wire2.geometry, starGeo].forEach((g) => g.dispose());
        [core.material, wire.material, wire2.material, stars.material].forEach((m) => (m as import('three').Material).dispose());
        renderer.dispose();
      });
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return <canvas ref={canvas} id="c3d" aria-hidden="true" style={disabled ? { display: 'none' } : undefined} />;
}
