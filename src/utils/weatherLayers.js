export const weatherLayerConfig = {
  wind: {
    label: 'Ветер',
    caption: 'флюгеры, м/с',
    values: ['0', '5', '10', '15', '20+'],
  },
  ice: {
    label: 'Лед',
    caption: 'сплоченность, %',
    values: ['0', '20', '40', '60', '80+'],
  },
  waves: {
    label: 'Волнение',
    caption: 'значимая высота, м',
    values: ['0', '1', '2', '3', '4+'],
  },
};

const windBarbBuckets = [0, 5, 10, 15, 20, 25];

export const weatherObservations = {
  wind: [
    { id: 'wind-barents-west', name: 'Баренцево море - запад', coordinates: [38.5, 70.2], speed: 8, direction: 64 },
    { id: 'wind-kara-west', name: 'Карское море - запад', coordinates: [58.5, 71.4], speed: 13, direction: 82 },
    { id: 'wind-yamal', name: 'Обская губа', coordinates: [72.8, 72.4], speed: 17, direction: 36 },
    { id: 'wind-dikson', name: 'Подходы к Диксону', coordinates: [82.8, 74.3], speed: 11, direction: 110 },
    { id: 'wind-laptev-west', name: 'Море Лаптевых - запад', coordinates: [104.0, 75.2], speed: 19, direction: 126 },
    { id: 'wind-laptev-east', name: 'Море Лаптевых - восток', coordinates: [126.0, 73.2], speed: 15, direction: 94 },
    { id: 'wind-east-siberian', name: 'Восточно-Сибирское море', coordinates: [154.0, 71.0], speed: 21, direction: 116 },
    { id: 'wind-chukchi', name: 'Чукотское море', coordinates: [172.0, 69.3], speed: 12, direction: 148 },
    { id: 'wind-bering', name: 'Берингов пролив', coordinates: [-174.0, 65.3], speed: 16, direction: 318 },
  ],
  ice: [
    { id: 'ice-barents', name: 'Баренцево море', coordinates: [43.0, 71.2], concentration: 8, radius: [7.5, 1.35] },
    { id: 'ice-kara-west', name: 'Карское море - запад', coordinates: [58.0, 72.2], concentration: 32, radius: [8.0, 1.4] },
    { id: 'ice-yamal', name: 'Ямал', coordinates: [72.5, 73.1], concentration: 47, radius: [6.8, 1.25] },
    { id: 'ice-dikson', name: 'Диксон', coordinates: [84.0, 74.8], concentration: 68, radius: [7.4, 1.55] },
    { id: 'ice-laptev', name: 'Море Лаптевых', coordinates: [112.0, 75.0], concentration: 74, radius: [13.0, 1.75] },
    { id: 'ice-tiksi', name: 'Тикси', coordinates: [129.0, 72.6], concentration: 53, radius: [8.2, 1.35] },
    { id: 'ice-east-siberian', name: 'Восточно-Сибирское море', coordinates: [156.0, 71.4], concentration: 39, radius: [12.5, 1.45] },
    { id: 'ice-chukchi', name: 'Чукотское море', coordinates: [171.0, 69.8], concentration: 26, radius: [8.0, 1.25] },
  ],
  waves: [
    { id: 'wave-white', name: 'Белое море', coordinates: [39.0, 65.7], height: 1.1, direction: 60, radius: [4.0, 1.0] },
    { id: 'wave-barents', name: 'Баренцево море', coordinates: [42.0, 70.1], height: 2.2, direction: 80, radius: [7.0, 1.35] },
    { id: 'wave-kara-west', name: 'Карское море - запад', coordinates: [61.0, 71.0], height: 1.6, direction: 92, radius: [8.0, 1.1] },
    { id: 'wave-yamal', name: 'Ямал', coordinates: [73.0, 72.0], height: 0.8, direction: 42, radius: [5.0, 0.9] },
    { id: 'wave-dikson', name: 'Диксон', coordinates: [84.0, 73.7], height: 1.4, direction: 112, radius: [5.8, 1.0] },
    { id: 'wave-laptev-west', name: 'Море Лаптевых - запад', coordinates: [108.0, 74.2], height: 2.7, direction: 124, radius: [9.0, 1.25] },
    { id: 'wave-laptev-east', name: 'Море Лаптевых - восток', coordinates: [130.0, 72.3], height: 2.0, direction: 95, radius: [9.5, 1.15] },
    { id: 'wave-east-siberian', name: 'Восточно-Сибирское море', coordinates: [158.0, 70.7], height: 3.4, direction: 112, radius: [11.0, 1.25] },
    { id: 'wave-bering', name: 'Берингов пролив', coordinates: [-173.0, 64.8], height: 2.6, direction: 318, radius: [6.5, 1.0] },
  ],
};

function bucketWindSpeed(speed) {
  return windBarbBuckets.reduce((closest, bucket) =>
    Math.abs(bucket - speed) < Math.abs(closest - speed) ? bucket : closest
  );
}

function ellipsePolygon([centerLng, centerLat], [radiusLng, radiusLat], points = 56) {
  const coordinates = Array.from({ length: points + 1 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / points;
    return [
      Number((centerLng + Math.cos(angle) * radiusLng).toFixed(4)),
      Number((centerLat + Math.sin(angle) * radiusLat).toFixed(4)),
    ];
  });

  return [coordinates];
}

function polygonCollection(items, valueKey) {
  return {
    type: 'FeatureCollection',
    features: items.map((item) => ({
      type: 'Feature',
      properties: {
        id: item.id,
        name: item.name,
        label: `${item[valueKey]}`,
        ...item,
      },
      geometry: {
        type: 'Polygon',
        coordinates: ellipsePolygon(item.coordinates, item.radius),
      },
    })),
  };
}

function pointCollection(items, valueKey) {
  return {
    type: 'FeatureCollection',
    features: items.map((item) => ({
      type: 'Feature',
      properties: {
        id: item.id,
        name: item.name,
        label: `${item[valueKey]}`,
        barbIcon: `wind-barb-${bucketWindSpeed(item.speed)}`,
        ...item,
      },
      geometry: {
        type: 'Point',
        coordinates: item.coordinates,
      },
    })),
  };
}

export function windWeatherGeoJson() {
  return pointCollection(weatherObservations.wind, 'speed');
}

export function iceWeatherGeoJson() {
  return polygonCollection(weatherObservations.ice, 'concentration');
}

export function waveWeatherGeoJson() {
  return polygonCollection(weatherObservations.waves, 'height');
}

export function waveDirectionGeoJson() {
  return pointCollection(weatherObservations.waves, 'height');
}

function drawWindBarb(context, speed) {
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = '#0b2545';
  context.fillStyle = '#0b2545';
  context.lineWidth = 4;

  if (speed < 3) {
    context.beginPath();
    context.arc(0, 0, 9, 0, Math.PI * 2);
    context.stroke();
    return;
  }

  context.beginPath();
  context.moveTo(0, 30);
  context.lineTo(0, -28);
  context.stroke();

  let remaining = Math.round(speed / 5) * 5;
  let y = -24;

  while (remaining >= 20) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(17, y + 8);
    context.lineTo(0, y + 14);
    context.closePath();
    context.fill();
    y += 12;
    remaining -= 20;
  }

  while (remaining >= 10) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(20, y + 9);
    context.stroke();
    y += 10;
    remaining -= 10;
  }

  if (remaining >= 5) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(13, y + 6);
    context.stroke();
  }
}

function createCanvasImage(size, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  context.translate(size / 2, size / 2);
  draw(context);

  return {
    width: size,
    height: size,
    data: context.getImageData(0, 0, size, size).data,
  };
}

export function createWindBarbImages() {
  return windBarbBuckets.map((speed) => ({
    id: `wind-barb-${speed}`,
    image: createCanvasImage(96, (context) => drawWindBarb(context, speed)),
  }));
}

export function createIceHatchImage() {
  const size = 18;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  context.strokeStyle = 'rgba(11, 37, 69, 0.28)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(-4, size);
  context.lineTo(size, -4);
  context.moveTo(6, size + 4);
  context.lineTo(size + 4, 6);
  context.stroke();

  return {
    width: size,
    height: size,
    data: context.getImageData(0, 0, size, size).data,
  };
}

export function createWaveArrowImage() {
  return createCanvasImage(64, (context) => {
    context.strokeStyle = '#0b2545';
    context.fillStyle = '#0b2545';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    context.moveTo(-18, 8);
    context.bezierCurveTo(-8, -6, 6, 22, 18, 6);
    context.stroke();

    context.beginPath();
    context.moveTo(18, 6);
    context.lineTo(10, 4);
    context.lineTo(15, -4);
    context.closePath();
    context.fill();
  });
}
