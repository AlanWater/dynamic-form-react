import { defineConfig } from 'dumi';
const env = process.env.NODE_ENV;
export default defineConfig({
  title: '表单编辑器',
  outputPath: 'docs-dist',
  publicPath: env === 'production' ? 'https://alanwater.github.io/dynamic-form-react/' : '/',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  // more config: https://d.umijs.org/config
});
