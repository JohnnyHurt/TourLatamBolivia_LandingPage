import { app } from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`🚀 TourLatam 2026 API Server listening on port ${config.port}`);
  console.log(`📡 Environment: ${config.env}`);
  console.log(`🌐 API Endpoint: ${config.apiUrl}`);
});
