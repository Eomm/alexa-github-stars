'use strict';

const http = require('https');
const log = require('./log');

class GithubInfo {
  constructor(token) {
    this.authToken = token;
  }

  _post(query) {
    return new Promise((resolve, reject) => {
      const opts = {
        host: 'api.github.com',
        port: 443,
        path: '/graphql',
        method: 'POST',
        headers: {
          'User-Agent': 'Alexa Lambda Function',
          'Authorization': `bearer ${this.authToken}`,
        }
      };

      const request = http.request(opts, function (response) {
        let result = '';
        response.setEncoding('utf8');
        response.on('data', function (data) {
          result += data;
        });
        response.on('end', function () {
          resolve(JSON.parse(result));
        });
      });
      request.on('error', reject);
      request.write(query);
      request.end();
    });
  }

  getFollowersCount(userId) {
    // FIXME bad way to pass parameter!
    return this._post(`{
      "query": "query { user (login: ${userId})  { followers{totalCount} }}"
    }`)
      .then((result) => {
        log(JSON.stringify(result));
        if (result.data.user) {
          return result.data.user.followers.totalCount
        }
        let errMessage = 'NOT_FOUND';
        if (result.errors) {
          errMessage = result.errors.pop();
        }
        throw new Error(errMessage);
      });
  }

}

module.exports = GithubInfo;
