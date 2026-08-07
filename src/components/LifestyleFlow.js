import React, { useEffect } from 'react';
import flow1 from '../Images/lifestyle/flow1.png';
import flow2 from '../Images/lifestyle/flow2.png';
import flow3 from '../Images/lifestyle/flow3.png';
import flow4 from '../Images/lifestyle/flow4.png';
import flow5 from '../Images/lifestyle/flow5.png';
import flow6 from '../Images/lifestyle/flow6.png';
import flow7 from '../Images/lifestyle/flow7.png';

const LIFESTYLE_IMAGES = [flow1, flow2, flow3, flow4, flow5, flow6, flow7];

const LEFT_COLUMN = [flow1, flow3, flow5, flow7];
const RIGHT_COLUMN = [flow2, flow4, flow6, flow1, flow5];

function syncFlowBounds() {
  const siteTop = document.querySelector('.site-top');
  if (siteTop) {
    document.documentElement.style.setProperty(
      '--site-top-h',
      `${siteTop.getBoundingClientRect().height}px`
    );
  }

  const footer = document.querySelector('.footer');
  if (!footer) {
    document.documentElement.style.setProperty('--site-footer-offset', '0px');
    return;
  }

  const footerTop = footer.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;

  if (footerTop < viewportHeight) {
    document.documentElement.style.setProperty(
      '--site-footer-offset',
      `${Math.max(0, viewportHeight - footerTop)}px`
    );
  } else {
    document.documentElement.style.setProperty('--site-footer-offset', '0px');
  }
}

function FlowColumn({ images, direction }) {
  const track = [...images, ...images];

  return (
    <div className={`lifestyle-flow__column lifestyle-flow__column--${direction}`}>
      <div className="lifestyle-flow__track">
        {track.map((src, i) => (
          <div key={i} className="lifestyle-flow__frame">
            <img src={src} alt="" loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LifestyleStrip() {
  const track = [...LIFESTYLE_IMAGES, ...LIFESTYLE_IMAGES];

  return (
    <div className="lifestyle-strip" aria-hidden="true">
      <div className="lifestyle-strip__track">
        {track.map((src, i) => (
          <div key={i} className="lifestyle-strip__frame">
            <img src={src} alt="" loading="lazy" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LifestyleFlow() {
  useEffect(() => {
    syncFlowBounds();

    const siteTop = document.querySelector('.site-top');
    const footer = document.querySelector('.footer');
    const observer = new ResizeObserver(syncFlowBounds);

    if (siteTop) observer.observe(siteTop);
    if (footer) observer.observe(footer);

    window.addEventListener('resize', syncFlowBounds);
    window.addEventListener('scroll', syncFlowBounds, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncFlowBounds);
      window.removeEventListener('scroll', syncFlowBounds);
    };
  }, []);

  return (
    <div className="lifestyle-flow" aria-hidden="true">
      <FlowColumn images={LEFT_COLUMN} direction="up" />
      <FlowColumn images={RIGHT_COLUMN} direction="down" />
    </div>
  );
}
