const presets = [
  [
    "@babel/preset-env",
    {
      targets:{
        node: "10.15",
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      },
      "useBuiltIns": "entry",
      "corejs":  "3.0"
    }
    
  ]
];

module.exports = {presets};
