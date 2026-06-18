# Hero Moving Prep Image Manifest

## Purpose

This document defines the source image and final production image requirements for the AI Moving Assistant / 引越し準備ボード top page Hero image.

## Source Image

Canonical source image:

```text
apps/landing/assets/source/hero-moving-prep-original.svg
```

This file stores the original generated image as an SVG wrapper containing the original PNG data. This avoids binary corruption through text-based GitHub tooling while preserving the original image pixels without re-compression.

## Current Runtime Image

Current Hero image used by the site:

```text
apps/landing/assets/images/hero-moving-prep-main.svg
```

This should represent the original visual image, not a manually recreated vector approximation.

## Final Production Image Target

Final target image to create:

```text
apps/landing/assets/images/hero-moving-prep-wide.png
```

Recommended production dimensions:

```text
1920 x 800
```

Acceptable alternatives:

```text
1920 x 900
2048 x 900
```

## Composition Requirements

The homepage layout has text on the left and the image on the right.

Therefore:

- Keep the main objects on the right side.
- Do not move cardboard boxes, checklist board, suitcase, tape, sofa, or plants into the left text area.
- Extend / outpaint the left side only with natural background elements.
- Left side should be mainly bright curtain, wall, floor, soft light, and fade space.
- The goal is to remove the visible hard edge between page gradient and image.
- Do not replace the original image style with a different illustration style.

## Current Source Image Characteristics

```text
Original size: 1536 x 1024
Aspect ratio: 3:2
Problem: Not wide enough for Hero background use
```

The image quality itself is good. The problem is layout fit, not the original concept.

## Required Transformation

```text
Original 1536 x 1024
↓
Outpaint / extend left side
↓
Keep right-side objects in place
↓
Export 1920 x 800 Hero-ready image
```

## CSS Target After Final Image Exists

Once `hero-moving-prep-wide.png` exists, the Hero CSS should use it directly:

```css
background-image: url("/assets/images/hero-moving-prep-wide.png");
background-size: cover;
background-position: right center;
background-repeat: no-repeat;
```

## Important Notes

- Do not use a low-resolution raster image embedded in SVG for the final Hero background.
- Do not downscale the layout just to hide rough image quality.
- Do not manually redraw the scene as a simplified vector illustration.
- If using AI image generation, generate/outpaint from the original image and preserve the existing right-side composition.
- The final homepage should preserve the current layout: left text, right image.
