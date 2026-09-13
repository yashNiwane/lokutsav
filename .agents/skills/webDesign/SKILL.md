---
name: human-designed-ui
description: Build distinctive, production-quality web interfaces that feel intentionally designed by a human designer rather than generated from generic AI/SaaS patterns. Use for all frontend UI, page design, component design, visual systems, and UI refactoring.
---

# Human-Designed UI Skill

## Core objective

Create interfaces with a clear visual point of view, strong hierarchy, and intentional details.

The result must NOT look like a generic AI-generated SaaS dashboard, template, or landing page.

Prioritize:
1. Product purpose
2. Information hierarchy
3. Typography
4. Layout/composition
5. Spacing
6. Color
7. Interaction
8. Motion

Do not add visual effects merely because they are fashionable.

## Design process

Before implementing a page:

1. Identify the page's primary user and primary task.
2. Identify the most important information/action.
3. Establish a visual hierarchy.
4. Choose a layout appropriate to the content.
5. Define typography, spacing, colors, borders, radius, and states.
6. Build reusable components only where repetition is real.
7. Review the page at desktop and mobile widths.
8. Remove anything decorative that does not improve comprehension or brand identity.

Do not blindly follow common SaaS templates.

## Anti-AI design rules

Avoid these unless the product genuinely requires them:

- Purple-to-blue gradients
- Neon glows
- Excessive glassmorphism
- Floating translucent blobs
- Gradient text
- Giant rounded cards
- Excessive pill-shaped controls
- Every section being a card
- Generic "hero + 3 cards + testimonials + CTA" layouts
- Generic dashboard grids
- Excessive shadows
- Huge meaningless headlines
- Decorative AI sparkles
- Excessive animated backgrounds
- Random abstract illustrations
- Excessive use of emojis
- Stock-photo-heavy layouts
- "Modern", "innovative", "revolutionary" filler copy
- Making every element rounded
- Making every section visually identical

Never use visual trends as a substitute for design decisions.

## Layout

Use composition deliberately.

Prefer:
- Strong alignment
- Clear columns
- Controlled whitespace
- Editorial layouts
- Asymmetry when it improves hierarchy
- Full-bleed sections when appropriate
- Dense layouts when the product is information-heavy
- Generous whitespace when the product is content-focused
- Deliberate vertical rhythm

Do not center everything by default.

Do not force every section into a max-width card.

Use the content to determine the layout.

## Typography

Typography is a primary design element.

Use a small, deliberate type scale.

Prioritize:
- Readability
- Contrast between heading/body/meta text
- Appropriate line lengths
- Strong hierarchy
- Consistent font weights

Avoid:
- Excessively huge headings
- Too many font weights
- Tiny low-contrast text
- Decorative fonts unless the brand calls for them

Use one primary typeface unless there is a clear reason for a secondary typeface.

## Color

Use a restrained palette.

Define semantic tokens such as:

- background
- foreground
- muted foreground
- border
- primary
- primary foreground
- secondary
- destructive
- success
- warning

Do not invent a different color for every component.

Accent color should communicate hierarchy and interaction, not decorate the entire interface.

## Borders, radius, and shadows

Choose a visual language and apply it consistently.

Do not make every element heavily rounded.

Use border radius according to component type:
- Inputs/buttons: restrained radius
- Cards: moderate radius when useful
- Large containers: radius only when composition benefits from it
- Dense/data interfaces: often smaller radii

Use shadows sparingly.

Prefer borders and spacing for structure when possible.

## Components

Build components around actual product needs.

Common primitives:
- Button
- Input
- Select
- Checkbox
- Radio
- Tabs
- Dialog
- Dropdown
- Tooltip
- Toast
- Table
- Navigation
- Pagination
- Empty state
- Loading state
- Error state

Components must have:
- Hover state where appropriate
- Focus-visible state
- Disabled state where appropriate
- Loading state where appropriate
- Error state where appropriate

Do not create abstractions solely to make the code look sophisticated.

## Forms

Forms should feel functional, not decorative.

Always provide:
- Clear labels
- Useful placeholder text only when needed
- Validation feedback
- Error messages near the relevant field
- Keyboard accessibility
- Visible focus states
- Appropriate input types

Do not rely on placeholder text as the label.

## Navigation

Navigation should reflect information architecture.

Avoid:
- Huge navigation bars
- Unnecessary menu items
- Decorative navigation
- Hiding important actions behind excessive menus

For dashboards, prioritize the user's frequent workflows over visual symmetry.

## Data-heavy interfaces

For tables, admin panels, analytics, and dashboards:

- Optimize for scanning.
- Use alignment intentionally.
- Keep row density appropriate.
- Use typography and spacing to establish hierarchy.
- Avoid turning every metric into a giant card.
- Use charts only when they communicate something a number cannot.
- Make filters and actions easy to discover.

## Empty, loading, and error states

Design these deliberately.

Empty states should explain:
- What is missing
- Why it matters
- What the user can do next

Loading states should preserve layout where possible.

Errors should explain the problem and recovery path.

Never use generic "Something went wrong" when a useful explanation is possible.

## Motion

Motion must communicate state or hierarchy.

Prefer:
- Short transitions
- Subtle hover feedback
- Meaningful enter/exit animations
- Smooth disclosure
- Skeleton loading where appropriate

Avoid:
- Animation on everything
- Long entrance animations
- Constant movement
- Distracting parallax
- Decorative particle effects

Respect `prefers-reduced-motion`.

## Responsive design

Design mobile intentionally rather than simply shrinking desktop.

Check:
- Navigation
- Tables
- Forms
- Modals
- Typography
- Spacing
- Touch targets
- Overflow
- Long text
- Empty/error states

Do not allow horizontal overflow unless the component genuinely requires it.

## Accessibility

Follow WCAG-oriented practices.

Requirements:
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Appropriate ARIA only when necessary
- Sufficient contrast
- Alt text for meaningful images
- Reduced-motion support
- Logical heading hierarchy

Never sacrifice accessibility for visual styling.

## Technical implementation

Preferred stack when the project already uses it:

- React / Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix primitives

Do not introduce a new UI library without a reason.

Keep styling centralized through design tokens where practical.

Prefer reusable primitives over duplicated styles.

Avoid unnecessary dependencies.

## Images and visual assets

Use imagery only when it contributes to the product.

Prefer:
- Real product imagery
- Original illustrations
- Purposeful photography
- Simple graphical assets
- Carefully selected icons

Avoid generic AI-looking illustrations.

Do not add an illustration just to fill empty space.

## Content

UI copy should be specific and useful.

Avoid filler such as:
- "Unlock your potential"
- "The future of..."
- "Seamlessly"
- "Revolutionize"
- "Powerful solutions"
- "Take your experience to the next level"

Use language that describes the actual product, action, or outcome.

## Reference products

When useful, study established products for interaction patterns, not for copying their visual identity.

Good references may include:
- Linear
- Stripe
- Notion
- GitHub
- Vercel
- Apple
- Airbnb
- Bloomberg
- GOV.UK

Do not clone any reference. Extract principles and adapt them to the product.

## Before finishing any UI task

Ask internally:

- Does this look like a generic AI-generated interface?
- Is there a clear visual hierarchy?
- Is every major element necessary?
- Is the typography doing useful work?
- Is spacing intentional?
- Are cards being overused?
- Are gradients/glows being used without a real reason?
- Does the design have a recognizable visual character?
- Does mobile feel intentionally designed?
- Are all interactive states handled?
- Is the interface accessible?

If the answer to the first question is yes, redesign before completing the task.

## Final implementation standard

The UI should feel:
- Intentional
- Specific to the product
- Restrained
- Usable
- Distinctive
- Production-ready

Do not optimize for "wow" screenshots at the expense of usability.
