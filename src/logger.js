/* eslint-disable prefer-destructuring */
const config = require('./config');

export class Logger {
  constructor() {
    this.projectId = config.sentry.projectId;
    this.apiKey = config.sentry.apiKey;
    this.secretKey = config.sentry.secretKey;
    this.headers = new Headers();
    this.headers.append('User-Agent', 'CF/1.0');
    this.url = `https://sentry.io/api/${this.projectId}/store/?sentry_version=7&sentry_key=${this.apiKey}&sentry_secret=${this.secretKey}`;
  }

  logError(ex, request) {
    const errorType = ex.name;
    const errorMessage = ex.message;
    const frames = this.generateFrames(ex).reverse();
    const data = this.generateBody(request);
    const url = new URL(request.url);
    const headersObj = this.generateHeaders(request);

    const body = {
      project: this.projectId,
      logger: 'worker',
      platform: 'javascript',
      exception: {
        values: [
          {
            type: errorType,
            value: errorMessage,
            stacktrace: { frames },
          },
        ],
      },
      request: {
        url: request.url,
        method: request.method,
        data,
        query_string: url.searchParams.toString(),
        cookies: request.headers.get('cookie'),
        headers: headersObj,
      },
      server_name: url.host,
      transaction: url.pathname,
      release: RELEASE_VERSION,
      environment: `${config.sentry.env}`,
    };

    return fetch(this.url, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: this.headers,
    });
  }

  generateHeaders(request) {
    const headersObj = {};
    for (const pair of request.headers.entries()) {
      headersObj[pair[0]] = pair[1];
    }
    return headersObj;
  }

  generateFrames(ex) {
    const lines = ex.stack.split('\n');
    lines.splice(0, 2);
    return lines.map(line => {
      const lineMatch = line.match(
        /at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/,
      );
      const functionName = lineMatch[1];
      const fileName = lineMatch[2];
      const lineNumber = parseInt(lineMatch[3]);
      const columnNumber = parseInt(lineMatch[4]);
      return {
        filename: fileName ? path.join('~/', fileName.toString()) : fileName,
        function: functionName,
        lineno: lineNumber,
        colno: columnNumber,
      };
    });
  }

  generateBody(request) {
    let data = request.body;
    if (['GET', 'HEAD'].indexOf(request.method) === -1) {
      if (typeof data === 'undefined') {
        data = '<unavailable>';
      }
    }

    if (
      data &&
      typeof data !== 'string' &&
      {}.toString.call(data) !== '[object String]'
    ) {
      // Make sure the request body is a string
      data = JSON.stringify(data);
    }

    return data;
  }
}
