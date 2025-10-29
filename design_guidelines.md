# Design Guidelines: 高精度医療問診AI iPhone App

## Design Approach

**Selected Approach:** Design System - Apple Human Interface Guidelines (HIG)
**Justification:** Medical applications demand reliability, clarity, and trust. The utility-focused nature of medical consultation requires a proven, accessible design system. Apple HIG provides the perfect foundation for iPhone-optimized healthcare experiences with emphasis on readability, safety, and user confidence.

**Design Principles:**
1. **Medical Clarity:** Every element prioritizes comprehension over decoration
2. **Calm Professionalism:** Design reduces patient anxiety through clean, organized layouts
3. **Trust Through Consistency:** Familiar iOS patterns build confidence in medical context
4. **Safety First:** Critical information (emergencies, disclaimers) are impossible to miss

---

## Core Design Elements

### A. Typography

**Primary Font:** SF Pro (iOS system font)
- Display/Headers: SF Pro Display, 700 weight, 24-28px
- Body Text: SF Pro Text, 400 weight, 16-17px
- Medical Emphasis: SF Pro Text, 600 weight, 16-17px
- Small Print/Meta: SF Pro Text, 400 weight, 13-14px

**Japanese Typography Adjustments:**
- Increased line-height: 1.7-1.8 for Japanese characters
- Letter-spacing: 0.02em for improved readability
- Paragraph spacing: 1.5rem minimum between blocks

**Hierarchy:**
- Chat Messages (User): 17px, regular weight
- Chat Messages (AI): 17px, regular weight
- Question Counter: 14px, medium weight
- Confidence Level: 15px, semibold
- Emergency Warnings: 18px, bold
- Final Report Headers: 20px, bold
- Final Report Body: 16px, regular

---

### B. Layout System

**Spacing Primitives (Tailwind Units):**
- Micro spacing: 2, 4 (margins between related elements)
- Standard spacing: 6, 8 (component padding, gaps)
- Section spacing: 12, 16 (major section separations)
- Screen margins: 4, 6 (mobile edge padding)

**Layout Structure:**
- Screen container: Full viewport with safe area insets
- Content max-width: 100% on mobile (edge-to-edge thinking)
- Chat container: px-4, py-6
- Message bubbles: px-4, py-3
- Input area: px-4, py-4

**Vertical Rhythm:**
- Message spacing: space-y-4
- Section breaks: mt-8 to mt-12
- Input to chat gap: fixed bottom positioning with pb-4

---

### C. Component Library

#### 1. App Shell
**Header (Fixed Top):**
- Height: 64px with iOS status bar consideration
- Left: Back button (if applicable) or app logo icon
- Center: "医療問診AI" title (16px, semibold)
- Right: Menu/settings icon
- Bottom border: 1px subtle divider
- Background: Solid with slight blur effect

**Progress Indicator Bar:**
- Position: Below header
- Height: 48px
- Left side: Question counter badge "質問 X/50"
- Right side: Confidence meter "確信度 XX%"
- Padding: px-4, py-3
- Background: Subtle differentiated from main area

#### 2. Chat Interface
**Message Bubbles - User:**
- Alignment: Right-aligned
- Max-width: 80% of container
- Padding: px-4, py-3
- Border-radius: 18px (iOS native feel)
- Tail: Small speech bubble tail on right

**Message Bubbles - AI:**
- Alignment: Left-aligned
- Max-width: 85% of container (slightly wider for medical info)
- Padding: px-4, py-3
- Border-radius: 18px
- Tail: Small speech bubble tail on left
- Character counter: Subtle "(123/200)" below bubble when applicable

**Timestamp/Meta:**
- Position: Below each message
- Font-size: 12px
- Opacity: 0.6

#### 3. Input Area (Fixed Bottom)
**Container:**
- Position: Fixed bottom with safe area inset
- Background: Solid with subtle top border
- Padding: px-4, py-4
- Shadow: Subtle elevation shadow

**Text Input Field:**
- Height: Minimum 44px (iOS touch target)
- Multi-line: Auto-expand up to 4 lines
- Border-radius: 20px
- Padding: px-4, py-2
- Placeholder: "ご回答を入力してください..."

**Send Button:**
- Size: 44x44px (iOS touch target)
- Position: Right side of input
- Icon: Paper plane or arrow
- Border-radius: 50% (circular)
- Disabled state: When input empty

#### 4. Special Components

**Disclaimer Modal (Initial):**
- Full-screen overlay with semi-transparent backdrop
- Modal card: Centered, max-width 90%, px-6, py-8
- Border-radius: 16px
- Scrollable content area
- Prominent "同意する" button at bottom (w-full, h-12)
- "戻る" secondary option

**Emergency Warning Banner:**
- Full-width, prominent placement
- Padding: px-6, py-4
- Icon: Alert/warning symbol (left side)
- Bold text: 18px
- Action button: "救急連絡" (immediate visibility)
- Border-radius: 12px

**Final Report View:**
- Scrollable full-screen view
- Header: Fixed with "診断レポート" title
- Content sections with clear visual hierarchy:
  - Section headers: 20px, bold, mt-8
  - Bullet points: Proper indentation (ml-6)
  - Confidence badge: Large, prominent (64x64px)
  - Dividers between major sections
- Bottom actions: "PDFダウンロード" and "新規問診" buttons
- Padding: px-6, py-8

**Loading States:**
- Message typing indicator: Three animated dots
- Skeleton screens for report generation
- Position: Left-aligned like AI messages

#### 5. Navigation & Actions

**Primary Action Buttons:**
- Height: 48-52px
- Width: Full-width or minimum 120px
- Border-radius: 12px
- Font: 16px, semibold
- Touch feedback: Subtle scale animation

**Secondary Buttons:**
- Height: 44px
- Border-radius: 10px
- Font: 15px, medium

**Icon Buttons:**
- Size: 44x44px minimum (iOS touch target)
- Icon size: 24x24px
- Border-radius: 8px or circular

---

### D. Interaction Patterns

**Chat Scrolling:**
- Auto-scroll to bottom on new messages
- Smooth scroll behavior
- "Scroll to bottom" floating button when scrolled up

**Input Behavior:**
- Auto-focus after AI question appears
- Return key submits (with shift+return for new line on desktop)
- Character counter appears when approaching 200 limit

**Transitions:**
- Message appearance: Fade-in with slight slide-up (150ms)
- Modal entry/exit: Scale and fade (250ms)
- Button interactions: Subtle scale (0.95) on press

**Animations:**
Use extremely sparingly:
- Loading dots only
- Confidence meter fill animation (once, on report)
- No decorative animations

---

## Mobile-First Specifications

**iPhone Specific:**
- Respect safe area insets (top notch, bottom home indicator)
- Minimum touch targets: 44x44px
- Thumb-zone optimization: Primary actions in bottom 1/3
- Keyboard handling: Input area shifts up with keyboard
- Pull-to-refresh: Reload conversation capability

**Responsive Breakpoints:**
- Mobile (default): < 768px
- Tablet/Desktop: 768px+ (centered chat column, max-width 600px)

---

## Accessibility

**WCAG 2.1 AA Compliance:**
- Text contrast ratios: 4.5:1 minimum
- Focus indicators: 2px solid outline on all interactive elements
- Screen reader: Proper ARIA labels for all chat messages
- Keyboard navigation: Full support with logical tab order
- Text scaling: Support iOS Dynamic Type (up to 200%)
- VoiceOver: Comprehensive labels for medical context

**Medical-Specific:**
- Emergency warnings: ARIA role="alert"
- Question counter: Announced on change
- Report sections: Proper heading hierarchy (h1-h4)

---

## Content Strategy

**Character Limits:**
- AI responses: 200 characters (strictly enforced)
- User responses: No limit, but encourage conciseness
- Final report: No limit

**Language:**
- Primary: Japanese
- Formal but empathetic tone
- Medical terminology with laymen explanations

---

## Images

**No images required** for this application. The medical consultation interface is entirely text-based with no hero sections or decorative imagery. Focus remains on clarity and functionality.

Exception: Icon library needed for:
- Alert/warning symbols
- Progress indicators
- UI controls (send, menu, back)
Use SF Symbols (iOS native icon set) for perfect iOS integration.