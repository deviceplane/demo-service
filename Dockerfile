FROM ubuntu:18.04
RUN apt-get update
RUN apt-get install -y qemu-user-static

FROM arm32v7/node
COPY --from=0 /usr/bin/qemu-arm-static /usr/bin/qemu-arm-static
COPY ./ ./
RUN npm install
ENTRYPOINT ["/usr/local/bin/node", "app.js"]
