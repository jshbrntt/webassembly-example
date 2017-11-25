# Base Images
FROM node:carbon as node
FROM rust:jessie as rust
FROM buildpack-deps:jessie
# Emscripten
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list \
 && apt-get update && apt-get install -y \
    build-essential \
    default-jre \
 && apt-get -t jessie-backports install -y cmake \
 && rm -rf /var/lib/apt/lists/* \
 && wget -q https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz -P /tmp \
 && tar -xvf /tmp/emsdk-portable.tar.gz -C /usr/lib \
 && ln -s /usr/lib/emsdk-portable/emsdk /usr/bin/emsdk \
 && rm /tmp/emsdk-portable.tar.gz \
 && emsdk update \
 && emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit \
 && emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit \
 && rm -rf /usr/lib/emsdk-portable/clang/fastcomp/build_incoming_64/lib \
 && rm -rf /usr/lib/emsdk-portable/clang/fastcomp/build_incoming_64/tools \
 && rm -rf /usr/lib/emsdk-portable/clang/fastcomp/src \
 && rm -rf /usr/lib/emsdk-portable/emscripten/incoming/.git \
 && rm -rf /usr/lib/emsdk-portable/emscripten/incoming/tests
ENV PATH=/usr/lib/emsdk-portable:$PATH \
    PATH=/usr/lib/emsdk-portable/clang/fastcomp/build_incoming_64/bin:$PATH \
    PATH=/usr/lib/emsdk-portable/emscripten/incoming:$PATH
# Node.js and Yarn
COPY --from=node /opt/yarn /opt/yarn
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/include/node /usr/local/include/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs \
 && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
 && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
 && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn \
 && ln -s /opt/yarn/bin/yarn /usr/local/bin/yarnpkg
ENV NODE_VERSION 8.9.1
ENV YARN_VERSION 1.3.2
# Rust
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup
COPY --from=rust /usr/local/rustup/settings.toml /usr/local/rustup/settings.toml
COPY --from=rust /usr/local/rustup/toolchains /usr/local/rustup/toolchains
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH
RUN rustup target add wasm32-unknown-emscripten
# Project
WORKDIR /usr/src/webassembly-example
COPY package.json .
COPY yarn.lock .
RUN yarn install && yarn cache clean
# Default Command.
CMD npm run build
