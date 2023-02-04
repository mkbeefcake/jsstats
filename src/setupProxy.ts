const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  // proxy websocket
  app.use(
    proxy("/socket.io", {
      target: "http://localhost:3030/socket.io",
      changeOrigin: true,
      ws: true
    })
  );
};
