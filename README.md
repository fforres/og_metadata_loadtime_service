#### TODO:
- Test functions.
- "Promisify" (Async-await?) header parsing to ease error handling
- Parse Stylesheets and check for media queries to check if url is "mobile friendly"
- Batch process the meta-tags search (Parse them into an object as ./src/crawler:checkMetasForMobile)
- Dive deeper into checking "mobile friendlyness".
  - Compare with google API  
    - https://gist.github.com/shahariaazam/73c0644c6b2f2cba5ca2#file-google-mobile-friendliness-test-php/
- Test between Docker, [cluster](https://nodejs.org/api/cluster.html) or plain old [PM2](https://github.com/Unitech/pm2) for process scale.
- Add "customizable" port (Currently on 3000)

#### Installation
1. Clone/Download
2. `yarn` or `npm install`
3. run `npm start`
3. hit `http://localhost:3000/api?url=http://www.lunametrics.com/blog/2017/02/02/unlimited-data-studio-reports/`
