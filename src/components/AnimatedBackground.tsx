import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建几何图形类
    class GeometryShape {
      x: number;
      y: number;
      size: number;
      opacity: number;
      rotationSpeed: number;
      rotation: number;
      vx: number;
      vy: number;
      type: 'triangle' | 'circle' | 'square';

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 40 + 10;
        this.opacity = Math.random() * 0.1 + 0.02;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.rotation = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.type = ['triangle', 'circle', 'square'][Math.floor(Math.random() * 3)] as 'triangle' | 'circle' | 'square';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // 边界处理
        if (this.x < -this.size) this.x = (canvas?.width || window.innerWidth) + this.size;
        if (this.x > (canvas?.width || window.innerWidth) + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = (canvas?.height || window.innerHeight) + this.size;
        if (this.y > (canvas?.height || window.innerHeight) + this.size) this.y = -this.size;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;

        switch (this.type) {
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.stroke();
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 'square':
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
            break;
        }
        ctx.restore();
      }
    }

    // 创建图形数组
    const shapes: GeometryShape[] = [];
    for (let i = 0; i < 25; i++) {
      shapes.push(new GeometryShape());
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      shapes.forEach(shape => {
        shape.update();
        shape.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default AnimatedBackground;