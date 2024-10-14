module.exports = {
    apps : [
        {
          name: "smart-homolog",
          script: "npm run start:homolog",
          watch: true,
          env: {
              "PORT": 3033,
              "NODE_ENV": "development",
              "NEXT_PUBLIC_API_URL":"https://api-homolog.smartnewservices.com.br"
          },
        },
        {
            name: "smart",
            script: "npm run start:prod",
            watch: true,
            env: {
                "PORT": 3032,
                "NODE_ENV": "production",
                "NEXT_PUBLIC_API_URL":"https://api.smartnewservices.com.br"
            },
          }
    ]
  }