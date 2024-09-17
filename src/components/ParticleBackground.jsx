import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cometsRef = useRef([]);
  const blastRef = useRef(null);
  const particleCountRef = useRef(600);
  const regenerationRateRef = useRef(0);
  const regenerationStartTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = (count) => {
      const particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          mass: 0,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.001,
          closeParticles: {},
          isNew: false,
        });
        particles[i].mass = particles[i].radius * particles[i].radius;
      }
      return particles;
    };

    const createComet = () => {
        const side = Math.floor(Math.random() * 4);
        let x, y, speedX, speedY;
  
        switch (side) {
          case 0: // Top
            x = Math.random() * canvas.width;
            y = -20;
            speedX = (Math.random() - 0.5) * 2;
            speedY = Math.random() * 2 + 1;
            break;
          case 1: // Right
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            speedX = -(Math.random() * 2 + 1);
            speedY = (Math.random() - 0.5) * 2;
            break;
          case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            speedX = (Math.random() - 0.5) * 2;
            speedY = -(Math.random() * 2 + 1);
            break;
          case 3: // Left
            x = -20;
            y = Math.random() * canvas.height;
            speedX = Math.random() * 2 + 1;
            speedY = (Math.random() - 0.5) * 2;
            break;
        }
  
        return { x, y, speedX, speedY, radius: 3 };
      };

    const createBlast = (x, y) => {
        blastRef.current = {
          x,
          y,
          radius: 0,
          maxRadius: Math.max(canvas.width, canvas.height),
          startTime: Date.now(),
          duration: 1000, // 1 second blast duration
        };
      };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle blast effect
      if (blastRef.current) {
        const blast = blastRef.current;
        const elapsedTime = Date.now() - blast.startTime;
        const progress = Math.min(elapsedTime / blast.duration, 1);
        blast.radius = blast.maxRadius * progress;

        particlesRef.current = particlesRef.current.filter(particle => {
          const dx = particle.x - blast.x;
          const dy = particle.y - blast.y;
          const distanceFromBlast = Math.sqrt(dx * dx + dy * dy);

          if (distanceFromBlast <= blast.radius) {
            const angle = Math.atan2(dy, dx);
            const speed = (blast.radius - distanceFromBlast) / 10;
            particle.speedX = Math.cos(angle) * speed;
            particle.speedY = Math.sin(angle) * speed;
          }

          // Remove particles that are off-screen
          return particle.x >= 0 && particle.x <= canvas.width && 
                 particle.y >= 0 && particle.y <= canvas.height;
        });

        if (progress === 1) {
          blastRef.current = null;
          // Set regeneration start time to 5 seconds in the future
          regenerationStartTimeRef.current = Date.now() + 1000;
          particleCountRef.current = particlesRef.current.length;
        }
      }

      // Regenerate particles
      if (particlesRef.current.length < 600 && regenerationStartTimeRef.current) {
        if (Date.now() >= regenerationStartTimeRef.current) {
          if (regenerationRateRef.current === 0) {
            regenerationRateRef.current = 5; // Start regenerating 5 particles per frame
          }

          const particlesToAdd = Math.min(regenerationRateRef.current, 600 - particlesRef.current.length);
          const newParticles = createParticles(particlesToAdd).map(p => ({ ...p, isNew: true, opacity: 0 }));
          particlesRef.current.push(...newParticles);
          particleCountRef.current += particlesToAdd;

          // Gradually decrease regeneration rate
          regenerationRateRef.current = Math.max(regenerationRateRef.current - 0.1, 0);

          if (particlesRef.current.length === 600) {
            regenerationStartTimeRef.current = null; // Reset when fully regenerated
          }
        }
      }

      particlesRef.current.forEach((particle, index) => {
        // Circular motion
        particle.angle += particle.angleSpeed;
        particle.x += Math.cos(particle.angle) * 0.2;
        particle.y += Math.sin(particle.angle) * 0.2;

        // Gravitational attraction and merging logic
        for (let j = index + 1; j < particlesRef.current.length; j++) {
            const otherParticle = particlesRef.current[j];
            const dx = otherParticle.x - particle.x;
            const dy = otherParticle.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 100) {
              const force = (particle.mass * otherParticle.mass) / (distance * distance);
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              
              particle.speedX += forceDirectionX * force * 0.00001;
              particle.speedY += forceDirectionY * force * 0.00001;
              otherParticle.speedX -= forceDirectionX * force * 0.00001;
              otherParticle.speedY -= forceDirectionY * force * 0.00001;
  
              // Track close particles
              if (distance < particle.radius + otherParticle.radius) {
                const now = Date.now();
                if (!particle.closeParticles[j]) {
                  particle.closeParticles[j] = now;
                }
                if (!otherParticle.closeParticles[index]) {
                  otherParticle.closeParticles[index] = now;
                }
  
                // Check if particles have been close for 5 seconds
                if (now - particle.closeParticles[j] > 1000 && now - otherParticle.closeParticles[index] > 1000) {
                  const newRadius = Math.sqrt(particle.radius * particle.radius + otherParticle.radius * otherParticle.radius);
                  const newMass = particle.mass + otherParticle.mass;
                  const newX = (particle.x * particle.mass + otherParticle.x * otherParticle.mass) / newMass;
                  const newY = (particle.y * particle.mass + otherParticle.y * otherParticle.mass) / newMass;
  
                  particle.radius = newRadius;
                  particle.mass = newMass;
                  particle.x = newX;
                  particle.y = newY;
                  particle.speedX = (particle.speedX * particle.mass + otherParticle.speedX * otherParticle.mass) / newMass;
                  particle.speedY = (particle.speedY * particle.mass + otherParticle.speedY * otherParticle.mass) / newMass;
  
                  particlesRef.current.splice(j, 1);
                  j--;
  
                  // Clear closeParticles for the merged particle
                  particle.closeParticles = {};
                }
              } else {
                // Remove tracking if particles are no longer close
                delete particle.closeParticles[j];
                delete otherParticle.closeParticles[index];
              }
            }
          }

        // Move towards mouse and comets
        let totalForceX = 0;
        let totalForceY = 0;

        // Mouse attraction
        const mouseDx = mouseRef.current.x - particle.x;
        const mouseDy = mouseRef.current.y - particle.y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        
        if (mouseDistance < 100) {
          const mouseForceDirectionX = mouseDx / mouseDistance;
          const mouseForceDirectionY = mouseDy / mouseDistance;
          const mouseForce = (100 - mouseDistance) / 50;
          
          totalForceX += mouseForceDirectionX * mouseForce * 0.3;
          totalForceY += mouseForceDirectionY * mouseForce * 0.3;
        }

        // Comet attraction
        cometsRef.current.forEach(comet => {
            const cometDx = comet.x - particle.x;
            const cometDy = comet.y - particle.y;
            const cometDistance = Math.sqrt(cometDx * cometDx + cometDy * cometDy);
            
            if (cometDistance < 100) {
              const cometForceDirectionX = cometDx / cometDistance;
              const cometForceDirectionY = cometDy / cometDistance;
              const cometForce = (100 - cometDistance) / 50;
              
              totalForceX += cometForceDirectionX * cometForce * 0.3;
              totalForceY += cometForceDirectionY * cometForce * 0.3;
            }
          });

        // Apply total force
        particle.speedX += totalForceX;
        particle.speedY += totalForceY;

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Apply friction (reduced for slower deceleration)
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Fade in new particles
        if (particle.isNew) {
          particle.opacity = Math.min((particle.opacity || 0) + 0.05, 1);
          if (particle.opacity === 1) {
            particle.isNew = false;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.isNew 
          ? `rgba(255, 255, 255, ${particle.opacity})`
          : particle.color;
        ctx.fill();
      });

      // Animate comets (now invisible)
      cometsRef.current.forEach((comet, index) => {
        comet.x += comet.speedX;
        comet.y += comet.speedY;

        // Remove comet if it's off-screen
        if (comet.x < -50 || comet.x > canvas.width + 50 || 
            comet.y < -50 || comet.y > canvas.height + 50) {
          cometsRef.current.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseClick = (event) => {
      createBlast(event.clientX, event.clientY);
    };

    resizeCanvas();
    particlesRef.current = createParticles(600);
    animate();

    // Add comets at longer random intervals, with a lower limit on screen
    const addComet = () => {
      if (cometsRef.current.length < 3) { // Limit to 3 comets on screen
        cometsRef.current.push(createComet());
      }
      setTimeout(addComet, Math.random() * 15000 + 10000); // Add a new comet every 10-25 seconds
    };
    addComet();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none' }} />;
};

export default ParticleBackground;