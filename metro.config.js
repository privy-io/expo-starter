const { getDefaultConfig, mergeConfig } = require("@expo/metro-config");

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
const modulesToEnableExports = ["@privy-io/expo", "@privy-io/expo/passkey"];

const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  if (modulesToEnableExports.includes(moduleName)) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: true,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.resolveRequest = resolveRequestWithPackageExports;

module.exports = config;
