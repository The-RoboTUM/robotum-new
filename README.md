# 🤖 RoboTUM Website

This is the official website for **RoboTUM**, a student robotics initiative at the Technical University of Munich (TUM).  
Our mission is to bridge the gap between academia and industry in robotics by showcasing our projects, events, and collaborations.

Built with **React**, **Vite**, and **Tailwind CSS**, this site is fully responsive, modular, and designed for scalability.

## 🌍 Vision

To establish Munich as a global hub for robotics innovation and collaboration.

## 🎯 Goals

- Showcase RoboTUM’s technical, operational, and innovation projects.
- Highlight sponsors, events, and academic partnerships.
- Provide an easy way for new students and companies to get involved.

## 🧱 Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (custom design system in `globals.css`)
- **Routing:** React Router v7
- **Component System:** Reusable components (`Button`, `ImageFrame`, etc.)
- **Data Management:** Static JS data files (e.g., `/src/data/projects.js`)
- **Deployment:** GitHub Pages (temporary) → Custom Domain (production)

## 🗂 Folder Structure

```
src/
├── assets/               # Images, icons, logos
├── components/           # Reusable UI components
│    ├── ui/              # Buttons, ImageFrame, etc.
│    └── sections/        # Page sections (Hero, Events, Projects…)
├── data/                 # Static content files (projects.js, events.js, etc.)
├── pages/                # Route-based pages (Home, Partners, Projects…)
├── styles/               # globals.css, variables.css
├── utils/                # scrollToSection.js, hooks
├── tests/                # global tests (integration, e2e, setup)
├── App.jsx               # Root app with routes
├── main.jsx              # Entry point
└── vite.config.js        # Build & alias configuration
```

---

## ⚙️ Getting Started

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 16 or higher recommended).

### 2. Clone the Repository

```bash
git clone https://github.com/robotum/robotum-frontend.git
cd robotum-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

App runs at: http://localhost:5173/

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Build

```bash
npm run preview
```

---

## 🎨 Design System

- **Typography:** Exo (primary font)
- **Color Palette:** Defined in `/styles/variables.css`
- **Components:** Built with Tailwind utilities and reusable `Button` and `ImageFrame` components.
- **Section Spacing:** Use `.section-container` for consistent margins and paddings.
- **Backgrounds:** Apply `surface-*` and gradient classes for unified visual style.

---

## 👩‍💻 Development Guidelines

Follow these guidelines to maintain code quality and consistency across the project:

- Follow existing file structure and naming conventions.
- Use `@aliases` (defined in `vite.config.js`) for imports instead of relative paths.
- Create new sections in `/components/sections/[page]-sections/`.
- Define reusable data in `/data/*.js` instead of hardcoding.
- Use the shared `Button` and `ImageFrame` components for UI consistency.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` code improvement
  - `style:` visual or formatting changes

---

## 🧹 Code Quality

To ensure code quality and maintainability, run the following tools:

Run ESLint:

```bash
npm run lint
```

Auto-fix issues:

```bash
npm run lint:fix
```

Check for unused dependencies:

```bash
npm run depcheck
```

---

## 🤝 Contributing

We welcome new members to the RoboTUM development team!

### Steps to contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/my-new-feature
```

3. Make your changes and commit with clear messages.
4. Push your branch and open a Pull Request.

---

## 🚀 Deployment

### Development Build

Deployed via Vite dev server.

### Production Build

1. Run:

```bash
npm run build
```

---

## 🛠 Environment Variables

If applicable, define environment variables in a `.env` file at the root of the project. Example:

```
VITE_API_URL=https://api.robotum.info
```

Ensure `.env` files are excluded from version control if they contain sensitive information.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Lead:** Yermukhamed Shakhman  
**UI/UX Designer:** TU Design Club  
**Developers:** Maryna Redka & Ediz Perez Landeros  
📩 Contact: outreach@robotum.info

---

## 🧩 Upcoming Features

- Add CMS integration (Notion / Strapi)
- Animate sections with Framer Motion
- Add dark/light theme toggle
- Expand “Events” filtering and detail pages
- Internationalization (English / German)
