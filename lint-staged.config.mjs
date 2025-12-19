export default {
  '*.{js,ts,jsx,tsx,vue}': 'pnpm exec eslint --fix',
  '*': 'pnpm exec prettier --write --ignore-unknown',
};
