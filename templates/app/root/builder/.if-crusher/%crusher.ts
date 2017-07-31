import cacheCrusher from "cache-crusher"

import { Builder } from "."

export default function(builder: Builder) {
  const crusher = cacheCrusher({
    enabled: false,
    extractor: {
      urlBase: "<%= urls.staticBase %>/",
    },
    mapper: {
      counterparts: [{urlRoot: "<%= urls.staticBase %>", tagRoot: builder.dirs.src.root, globs: [
        "!vendor/**",
        "!images/favicon.ico",
        "!**/*.map",
      ]}],
    },
    resolver: {
      timeout: 20000,
    },
  });
  // crusher.extractorCatalog.registerExts("script", [".ts"]) // already in cache-crusher@2.0.0
  return crusher
}
