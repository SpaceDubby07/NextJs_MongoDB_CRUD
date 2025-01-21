# Next.js Real-Time Chat App

This project is a real-time chat application built with Next.js, offering features like custom chat rooms, user-selected usernames, and light/dark theme support. While login functionality is planned, it has not yet been implemented.

## Features

### 1. Real-Time Chat
- Users can create and join chat rooms.
- Messages are sent and received in real time using Socket.IO.

### 2. User Customization
- Users can select their own usernames.
- Chat rooms can be named by users.

### 3. Theming
- Light and dark mode support for improved user experience.

### 4. Planned Features
- Login functionality for persistent user accounts.

---

## Technologies Used

### Frontend
- **Next.js**: React framework for building the app.
- **React**: Core library for UI components.
- **React DOM**: Handles DOM rendering for React.
- **React Icons**: Provides a set of reusable icons.
- **React Pro Sidebar**: Sidebar navigation for chat rooms and settings.
- **Next Themes**: Handles light/dark mode toggling.
- **Heroicons**: A collection of SVG icons.

### Backend
- **Socket.IO**: Enables real-time communication between clients and server.
- **MongoDB**: Database for storing chat data and room information.
- **@auth/mongodb-adapter**: Authentication adapter for MongoDB (login functionality planned).
- **CORS**: Middleware for handling cross-origin resource sharing.

### Styling
- **TailwindCSS**: CSS framework for styling.
- **Tailwind Scrollbar**: Custom scrollbar styling.
- **PostCSS**: CSS post-processing tool for added flexibility.

---

## Installation

### Prerequisites
- Node.js >= 16.8.0
- npm or yarn
- MongoDB instance for backend data storage

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd nextjs-course
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.

---

## Future Improvements

- Implement user authentication with NextAuth.
- Add persistent user profiles and room history.
- Enhance chat room UI with additional features like user lists and notifications.
- Optimize the app for better scalability and performance.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- Open-source libraries and tools used in this project.
- MongoDB for database support.
- Socket.IO for enabling real-time communication.

