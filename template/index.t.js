/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  // Work with options here
  opts = opts || {};

  return {
    postcssPlugin: "apply-all",
    // Once(root) {
    //   root.walkAtRules((atRule) => {
    //     if (atRule.name === "apply-all") {
    //       atRule.name = "apply";
    //       atRule.params = parse(atRule.params).join(" ");
    //     }
    //   });
    // },
    AtRule: {
      "apply-all": (atRule) => {
        atRule.name = "apply";
        atRule.params = parse(atRule.params).join(" ");
      },
    },
  };
};

module.exports.postcss = true;
