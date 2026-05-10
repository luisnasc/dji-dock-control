# Mission Images

This directory contains placeholder images for DJI mission inspections.

## Placeholder Images

Currently, the following placeholder SVG images are available:

- `default.svg` - Default inspection icon
- `linha-01.svg` - Transmission line inspection
- `transformador.svg` - Transformer inspection
- `estrutura.svg` - Structure inspection
- `barragem.svg` - Dam/hydro plant inspection

## Replacing Placeholder Images

To replace the placeholder SVG images with real inspection photos:

1. Prepare your image files (JPG, PNG, WebP)
2. Name them according to the mission type:
   - `linha-01.jpg` - Transmission line
   - `transformador.jpg` - Transformer
   - `estrutura.jpg` - Structural element
   - `barragem.jpg` - Dam/hydro plant
   - `default.jpg` - Default fallback image

3. Place the new images in this directory

4. Update `frontend/src/App.jsx` in the `getMissionImage()` function to reference the new file extensions:

```javascript
const getMissionImage = (missionId) => {
  const imageMap = {
    1: "/assets/missions/linha-01.jpg",
    2: "/assets/missions/transformador.jpg",
    3: "/assets/missions/estrutura.jpg",
    4: "/assets/missions/barragem.jpg",
    5: "/assets/missions/barragem.jpg",
  };
  return imageMap[missionId] || "/assets/missions/default.jpg";
};
```

## Image Specifications

Recommended specifications for mission images:
- **Format**: JPG, PNG, or WebP
- **Dimensions**: 400x300px or larger (aspect ratio 4:3)
- **File Size**: Keep under 500KB for optimal performance
- **Content**: Clear, high-contrast photos of actual inspection sites

## Fallback Behavior

If an image fails to load, the UI will display a fallback placeholder icon (gear/construction emoji).
