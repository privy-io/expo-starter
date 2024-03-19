module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", {lazyImports: true}]],
    plugins: [["@babel/plugin-transform-class-properties", {loose: true}]],
  };
};
