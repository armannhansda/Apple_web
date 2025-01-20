import { useGSAP } from '@gsap/react';
import React, { useRef, useState } from 'react';
import ModelView from './ModelView';
import { yellowImg } from '../util';
import * as THREE from 'three';

const Model = () => {
  const [size, setSize] = useState('small');
  const [model, setModel] = useState({
    title: 'Iphone 15 pro in natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  });

  // camera control for the model view
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  // Ref for 3D model groups
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  // Initialize GSAP animations
  useGSAP(() => {
    gsap.to('#heading', {
      y: 0,
      opacity: 1,
    });
  });

  return (
    <section className="common-padding">
      <div className="cscreen-max-width">
        {/* Section heading with animation */}
        <h1 
          id="heading"
          className="section-heading">
          Take a closer look
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            {/* ModelView for small model */}
            <ModelView 
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />

            {/* ModelView for large model */}
            <ModelView 
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            {/* Canvas for rendering models */}
            <canvas
              className="w-full h-full"
              style={{
                position: 'absolute', // Updated to ensure correct positioning
                top: 0,
                left: 0,
              }}
            ></canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Model;

/**
 * Updates:
 * 1. Changed <canvas> position from 'fixed' to 'absolute' for better compatibility and layout control.
 * 2. Removed invalid property 'eventSource' from <canvas> tag (not supported by React or HTML5 Canvas).
 * 3. Added comments to clarify the purpose of each section (e.g., GSAP animations, ModelView components, etc.).
 * 4. Improved styling comments for the canvas to ensure responsive and bug-free rendering.
 */
