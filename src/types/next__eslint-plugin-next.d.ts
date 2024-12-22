declare module '@next/eslint-plugin-next' {
  const plugin: {
    configs: {
      recommended: {
        plugins: string[];
        rules: Record<string, unknown>;
      };
    };
  };
  export default plugin;
}
