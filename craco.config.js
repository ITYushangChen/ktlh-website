/** CRA — exclude node_modules from source-map-loader (avoids ENOENT / bad maps on deps). */
module.exports = {
  devServer: {
    proxy: {
      '/api/dev': {
        target: 'http://localhost:3099',
        changeOrigin: true,
      },
      '/api/contact': {
        target: 'https://formspree.io',
        changeOrigin: true,
        pathRewrite: { '^/api/contact': '/f/xjkrwloz' },
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // CRA's source-map-loader walks node_modules and often fails (ENOENT / bad map paths)
      // on @react-three/*, three, etc. We only need maps for app source.
      webpackConfig.module.rules.forEach((rule) => {
        if (!rule || !rule.loader) return;
        if (!String(rule.loader).includes('source-map-loader')) return;
        const prevEx = rule.exclude;
        const extra = /node_modules[/\\]/;
        if (Array.isArray(prevEx)) {
          if (!prevEx.some((ex) => String(ex) === String(extra))) {
            rule.exclude = [...prevEx, extra];
          }
        } else if (prevEx) {
          rule.exclude = [prevEx, extra];
        } else {
          rule.exclude = [extra];
        }
      });

      return webpackConfig;
    },
  },
};
