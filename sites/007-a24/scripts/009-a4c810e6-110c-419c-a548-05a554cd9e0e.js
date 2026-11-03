
  function valueNoise(x, y) {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function writeNormals(heightMap, data, size) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const left = heightMap[y * size + Math.max(0, x - 1)];
        const right = heightMap[y * size + Math.min(size - 1, x + 1)];
        const up = heightMap[Math.max(0, y - 1) * size + x];
        const down = heightMap[Math.min(size - 1, y + 1) * size + x];

        let nx = left - right;
        let ny = up - down;
        let nz = 1;

        const inverse = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        const index = (y * size + x) * 4;

        nx *= inverse;
        ny *= inverse;
        nz *= inverse;

        data[index] = (nx * 0.5 + 0.5) * 255;
        data[index + 1] = (ny * 0.5 + 0.5) * 255;
        data[index + 2] = (nz * 0.5 + 0.5) * 255;
        data[index + 3] = 255;
      }
    }
  }

  function frontNormal(size, s) {
    const data = new Uint8ClampedArray(size * size * 4);
    const heightMap = new Float32Array(size * size);
    const center = size / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = x - center;
        const dy = y - center;
        const radiusValue = Math.sqrt(dx * dx + dy * dy) + 0.0001;

        const optical = Math.sin(radiusValue * 0.6) * 0.02;
        const ink = (valueNoise(x * 0.4, y * 0.4) - 0.5) * 0.5 * s.texPrint;

        heightMap[y * size + x] = optical + ink;
      }
    }

    const scratchCount = Math.floor(30 * s.texScratches);

    for (let scratch = 0; scratch < scratchCount; scratch += 1) {
      const angle = Math.random() * Math.PI * 2;
      const length = 30 + Math.random() * 220;
      const startX = Math.random() * size;
      const startY = Math.random() * size;
      const deltaX = Math.cos(angle);
      const deltaY = Math.sin(angle);
      const depth = (Math.random() * 0.7 + 0.2) * s.texScratches;

      for (let step = 0; step < length; step += 1) {
        const px = Math.round(startX + deltaX * step);
        const py = Math.round(startY + deltaY * step);

        if (px < 1 || py < 1 || px >= size - 1 || py >= size - 1) continue;

        heightMap[py * size + px] -= depth;
      }
    }

    const dustCount = Math.floor(500 * s.texScratches);

    for (let dust = 0; dust < dustCount; dust += 1) {
      const px = Math.floor(Math.random() * size);
      const py = Math.floor(Math.random() * size);

      heightMap[py * size + px] += (Math.random() - 0.5) * s.texScratches * 1.2;
    }

    writeNormals(heightMap, data, size);
    return data;
  }

  function backNormal(size, s) {
    const data = new Uint8ClampedArray(size * size * 4);
    const heightMap = new Float32Array(size * size);
    const center = size / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = x - center;
        const dy = y - center;
        const radiusValue = Math.sqrt(dx * dx + dy * dy);

        const ring = Math.sin(radiusValue * 3.2) * 0.5 * s.backRadialDetail;
        const jitter = (valueNoise(x * 0.6, y * 0.6) - 0.5) * 0.06 * s.backRadialDetail;

        heightMap[y * size + x] = ring + jitter;
      }
    }

    writeNormals(heightMap, data, size);
    return data;
  }

  function frontRough(size, s) {
    const data = new Uint8ClampedArray(size * size * 4);
    const center = size / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        let roughness = s.frontRough;

        roughness += (valueNoise(x * 2.3, y * 2.3) - 0.5) * 0.35 * s.texGrain;
        roughness += (valueNoise(x * 0.5, y * 0.5) - 0.5) * 0.3 * s.texPrint;

        const dx = x - center;
        const dy = y - center;
        const radiusValue = Math.sqrt(dx * dx + dy * dy) / (size * 0.5);

        roughness -= (Math.sin(radiusValue * 14) * 0.5 + 0.5) * 0.5 * s.texGloss;
        roughness = clamp(roughness, 0.02, 1);

        const value = roughness * 255;
        const index = (y * size + x) * 4;

        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = 255;
      }
    }

    return data;
  }

  function backRough(size, s) {
    const data = new Uint8ClampedArray(size * size * 4);
    const center = size / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = x - center;
        const dy = y - center;
        const radiusValue = Math.sqrt(dx * dx + dy * dy);

        let roughness = s.backRough;

        roughness += Math.sin(radiusValue * 1.6) * 0.06 * s.backRadialDetail;
        roughness += (valueNoise(x * 1.2, y * 1.2) - 0.5) * 0.04 * s.backRadialDetail;
        roughness = clamp(roughness, 0.02, 1);

        const value = roughness * 255;
        const index = (y * size + x) * 4;

        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = 255;
      }
    }

    return data;
  }

  const builders = { frontNormal, backNormal, frontRough, backRough };

      self.onmessage = (event) => {
        const { id, job, size, settings } = event.data;
        try {
          const data = builders[job](size, settings);
          self.postMessage({ id, data }, [data.buffer]);
        } catch (error) {
          self.postMessage({ id, error: String(error && error.message || error) });
        }
      };