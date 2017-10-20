# redirect-rewrite-poc
A prototype to test out a concept for a redirect service, trying to figure out the best status code for different API responses and how clients handle them.

The idea being a service could return valid data with a 200, client errors 4xx, the resource has moved, the resource should be served by an existing URL or server errors 5xx.

## Running.

_POC uses native ES modules so you need Node 8.5._

```Bash
# Starting mock service
npm install
npm start

# Starts server on port 3000

# Routes
# /
# /200
# /404
# /305
# /308
# /503
```

Running server tests
```Bash
# Separate terminal
npm run start:request
```

Running client tests
```Bash
# Separate terminal
# Opens chrome check console to see results
npm run start:client
```

## Requirements.

We need to be able to handle multiple different types of response.

1) Success
2) Error
3) Rewrite
4) Redirect

### Success.

Success is standard, return correct data with 200 status code.

### Error.

Error again standard, return error message and with client 4xx or server 5xx error status code.

### Rewrites.

Rewrites happen when we want data, service tells us it comes it comes from but we want to serve it to a different URL. However We don't want to redirect, we want to proxy that content. This could be for vanity URL reasons.

### Redirect.

Redirects are when we are told where we want to get the resource from has moved, this could be permanently or temporary. The client might also not want to automatically follow the redirect but return the body of the new location and the status code associated.

## Recommendations.

My recommendations for rewrites and redirects responses.

### Rewrites.

Rewrites should have the following format.

```
response-headers:
  status: 305

body: {
  status: 200,
  location: 'http://proxy/content/url'
}
```

The status code 305 is for a proxy request, although deprecated, this indicates to the client the resource needs to be fetched from a different location. The body is then used to tell the client what they need to do next.

### Redirects.

Redirects should have the following format.

```
response-headers:
  status: 308
  location: http://new/url

body: {
  status: 301,
  location: http://new/url
}
```

The status code 308 is for a permanent redirect, this indicates to the client the resource has moved. The headers allow the client follow the redirect using location header, or if you client doesn't want to follow they can use the body and return the response. The body is then used to tell the client what they need to do next.

*NOTE:* When using fetch in the client, you can't seem to stop it automatically following a 308.

```Javascript
fetch('http://localhost:3000/308', { redirect: 'manual' }).then(data => {
  // returns status 0
});
```
This implies the redirect manual is terminating the request before its completed.

```Javascript
fetch('http://localhost:3000/308', { redirect: 'error' }).then(data => {}).catch(error => {
  // error returned
});
```
The error returned is just `TypeError: Failed to fetch` and there is no body.

I believe this is for security reasons, more can be read here: [https://github.com/whatwg/fetch/issues/66](https://github.com/whatwg/fetch/issues/66).

However we will never need to do rewrites in the browser as this is a routing concern.

### Examples.

Here is how you could potentially use this service and consume the status codes.

```Javascript

// example not following redirects
request({url:'http://my-service', followRedirect: false}).then(data => {
    if (data.statusCode === 200) {
      // successful data request
    }
    if (data.statusCode === 305) {
      // fetch(data.body.location).then(data => {
      //  res.statusCode = data.statusCode;
      //  res.send(data.body)
      // })
      //
    }
    if (data.statusCode === 308) {
      // res.statusCode = data.body.status
      // res.location = data.body.location
      // res.end();
    }
});

// example following redirects
request({url:'http://my-service'}).then(data => {
    if (data.statusCode === 200) {
      // successful data request
    }
    if (data.statusCode === 305) {
      // fetch(data.body.location).then(data => {
      //  res.statusCode = data.statusCode;
      //  res.send(data.body)
      // })
      //
    }
});

```
