// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
    isCSSEnabled: true,
});
config.resolver.sourceExts.push('cjs');

module.exports = config;