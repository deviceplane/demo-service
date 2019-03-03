FROM arm32v7/node
COPY ./ ./
ENTRYPOINT ["/usr/local/bin/node", "app.js"]
