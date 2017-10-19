# redirect-rewrite-poc
A prototype a redirect service, trying to figure out the best status for these API responses and then tests to see how clients handle them.

## Running

```Bash
npm install
npm start
```

Running server tests
```Bash
# Separate terminal
npm run start:request
```

Running client tests
```Bash
 open -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome http://localhost:3000/client
 # Open terminal
```

## Requirements.

We need a response to be able to handle different different types of response.

1) redirect
2) rewrite

### Redirects.

Redirects should not be auto-followed but can be (upto client), we should be encouraging people to know follow the api call unless they want to but return a status and a url to follow.

### Rewrites.

Rewrites happen when we want content on a URL and a service tells us it comes from a different place. We don't want to redirect, we want to proxy that content. This could be for vanity URL reasons.

## Recommendations

My recommendations for two different responses.

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

The status code 308 is for a permanent redirect. This allows with a follow redirect call to use the location header, or if you client doesn't want to transparently the redirect they can consume the body and can pass a direct up the chain to the client.


### Rewrites.

Rewrites should have the following format.

```
response-headers:
  status: 305

body: {
  status: 'rewrite',
  location: 'http://proxy/content/url'
}
```

The status code 305 is for a proxy request, this is now deprecated however it makes sense in our situation. This will let us identify content that should be a rewrite.

### Examples

```Javascript

// example following a redirect
request({url:'http://localhost:3000/308', followRedirect: false}).then(data => {
    if (data.statusCode === 200) {
      // successful data request
    }
    if (data.statusCode === 308) {
      // res.statusCode = data.body.status
      // res.location = data.body.location
      // res.end();
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
