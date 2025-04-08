# HCI Vision
Application for evaluating user interfaces based on the analysis of joint eye and mouse movements.

### Overview
Eye-Mouse Tracker is an advanced web application designed to assess user interfaces by analyzing the synchronized movements of the user's gaze and mouse cursor. The application collects real-time tracking data via a webcam using WebGazer.js and browser-based mouse event tracking, stores sessions locally, and performs detailed analytical computations such as correlation, linear regression, Synchronization Index (SI), and Dissonance Ratio (DR). Visualizations are rendered as heatmaps and correlation charts to provide clear insights into user behavior.

### Features
* **Real-Time Tracking.** Collects synchronized gaze and mouse data in real-time using WebGazer.js and browser MouseEvents.

* **Local Data Storage.** Stores each tracking session separately, allowing isolated analysis of user interactions.

* **Analytics with Web Workers.** Heavy analytical computations are offloaded to Web Workers, ensuring that the UI remains responsive.

* **Proxy Server for External Pages.** A proxy server built on Express with Cheerio for HTML manipulation enables loading external web pages into iframes while preserving their original styles.

* **Dynamic Visualizations.** Interactive heatmaps and correlation charts built with Recharts visualize the raw tracking data and computed metrics.

* **Modular Architecture.** Organized via an API Gateway that abstracts access to the various modules, including tracking, storage, analytics, and visualization.

### Technology Stack
* **TypeScript & React.** Ensures robust, strongly typed code and dynamic, modular UI components.

* **Vite.** Provides fast development and efficient production builds.

* **Express & Cheerio.** Implements a proxy server for fetching and adapting external web resources.

* **Web Workers.** Offloads heavy analytical computations to separate threads, enhancing performance and responsiveness.

* **EventEmitters.** Facilitates real-time communication between tracking services and storage.

### Installation & Running
Once the repository is cloned:
1. **Install dependencies.**
```
npm install
```
2. **Build the client application.**
```
npm run build
```
3. **Start the proxy server.**
```
npm run start:server
```
4. **Launch the development server.**
```
npm run dev
```
After running these commands, the application will be available at http://localhost:5173 or the configured port.
