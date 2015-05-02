module.exports = {
  entry: "./Group.js",
  output: {
    path: __dirname+'/bin',
    filename: "Group.js"
  },
  module: {
    loaders: [{ 
        test: /\.js$/, 
        loader: "babel" 
      }]
    }
};