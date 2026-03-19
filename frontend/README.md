# 💻 Workasana - Frontend Client

The frontend of Workasana is built for speed and developer experience. By bypassing heavy component libraries and utilizing raw Bootstrap 5 classes alongside custom CSS, the application achieves a highly polished, responsive theme.

## Environment Setup
To run the frontend locally, create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:3000
# For Production: VITE_API_URL=https://workasana-api.onrender.com
```

# Frontend Architecture

## State Management (Zustand)
Instead of using Redux boilerplate, Zustand manages the Authentication state (useAuthStore). It handles login, signup, token storage, and session hydration seamlessly without requiring <Provider> wrappers.

## API Interceptors (Axios)
To follow DRY principles, an Axios interceptor automatically intercepts every outgoing HTTP request and injects the Bearer <token> into the headers from localStorage.

## Responsive Layouts
The layout utilizes a dynamic wrapper (Layout.jsx).
- On **Desktop**, it renders a fixed sidebar, utilizing CSS margin transitions to push the main content to the right.
- On **Mobile**, it renders a top Navbar and an off-canvas sliding drawer controlled by Z-index layers and backdrop filters.

## Reusable Components
Extensive use of component composition:
- **FilterDropdown.jsx** & **SortDropdown.jsx** for universal data manipulation.
- **ProjectCard.jsx** & **TaskCard.jsx** for consistent data display.
AuthLayout.jsx to DRY up the login and signup screens.