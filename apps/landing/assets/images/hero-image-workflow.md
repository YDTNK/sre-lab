# Hero Image Workflow / Safeguards

## Purpose

Prevent recurrence of the 2026-06-18 Hero image regression.

The issue happened because the original generated image was not treated as the source of truth, and the image was replaced by a different SVG/vector approximation before confirming the actual visual asset and layout requirements.

## Source of Truth

The original generated image is the source asset.

```text
apps/landing/assets/source/hero-moving-prep-original.png
```

The homepage production Hero image is the wide, layout-ready asset.

```text
apps/landing/assets/images/hero-moving-prep-wide.png
```

The active Hero background should reference the production image.

```css
background-image: url("/assets/images/hero-moving-prep-wide.png");
```

## Composition Requirements

The homepage has text on the left and the Hero image on the right.

Rules:

- Keep the left side available for text.
- Keep cardboard boxes, checklist board, suitcase, tape, sofa, and plants on the right side.
- Do not move the main objects into the left or center text area.
- Extend / outpaint the left side only with natural background such as curtain, wall, floor, and soft light.
- Do not replace the original photo-like generated image with a simplified vector redraw.
- Do not reduce the displayed image size as the primary fix for poor quality.

## Correct Fix Pattern

When the Hero image looks rough, cropped, or shows a visible edge:

```text
1. Identify the actual rendered asset from CSS / HTML
2. Confirm the original source image
3. Preserve the original source image under assets/source/
4. Generate a wide Hero-ready image from the original
5. Keep objects on the right and extend only the left side
6. Save the result under assets/images/
7. Update CSS to reference the production wide image
8. Confirm PC / mobile Preview before merge
```

## Wrong Fix Pattern

Do not do the following:

```text
- Replace the image with a hand-written SVG approximation
- Change the design style without user confirmation
- Shrink the image just to hide roughness
- Assume an SVG file is vector-quality without checking its contents
- Modify image assets without confirming what the page actually references
```

## Required Verification

Before any Hero image PR is merged, check:

- The image appears in Preview
- The previous intended image identity is preserved
- The image is not blurry at Hero size
- No hard vertical image edge is visible
- Left text remains readable
- Main objects stay on the right
- PC layout is acceptable
- Mobile layout is acceptable

## Current Status

As of 2026-06-18:

```text
Source image committed: apps/landing/assets/source/hero-moving-prep-original.png
Wide production image committed: apps/landing/assets/images/hero-moving-prep-wide.png
CSS target: apps/landing/home-hero-background.css
Active reference: /assets/images/hero-moving-prep-wide.png
```
