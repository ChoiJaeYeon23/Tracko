module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // 이거 꼭 마지막 줄에 위치해야 함
  ],
};