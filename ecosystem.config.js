module.exports = {
    apps : [
        {
          name: "smart-homolog",
          script: "npm start",
          watch: true,
          env: {
              "PORT": 3033,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 3032,
              "NODE_ENV": "production",
          }
        }
    ]
  }