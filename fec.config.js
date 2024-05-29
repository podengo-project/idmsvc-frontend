module.exports = {
  appUrl: ['/settings/idmsvc'],
  debug: true,
  useProxy: true,
  useCloud: false,
  proxyVerbose: true,
  /**
   * Change to false after your app is registered in configuration files
   */
  // interceptChromeConfig: true,
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  hotReload: process.env.HOT === 'true',
  routes: {
    /* Add routes to the backend  */
    '/api/idmsvc/': { host: 'http://localhost:8000' },

    /* Add routes to the chrome-service*/
    // '/api/chrome-service/v1/static/': { host: 'http://localhost:9999' },

    /* Add routes to the rbac mock server */
    '/api/rbac/v1/access/': { host: 'http://localhost:8020' },
  },
};
