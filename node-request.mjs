import util from 'util';
import request from 'request';
import isomorphicFetch from 'isomorphic-fetch';

const rp = util.promisify(request);

function helper(status, title, call, message) {
  console.log(``);
  console.log(`=========${title}=========`);
  console.log(`..........................`);
  console.log(`---------${call}----------`);
  if (status === 'success') {
    console.log(message);
  } else {
    console.log('*******ERROR*******');
    console.error(message);
    console.log('*******************');
  }
  console.log('--------------------------');
  console.log(`..........................`);
  console.log(`==========================`);
  console.log(``);
}

// success
//----------------------------
// Request
// request 200
// returns body
rp('http://localhost:3000/200').then(data => {
  if (data.statusCode === 200) {
    helper('success', 'Request 200 lib', 'rewrite', data.body);
  } else {
    helper('error', 'Request 200 lib', 'rewrite', 'NOT SUCCESSFUL');
  }
});

// isomorphic-fetch
// request 200
// returns body
isomorphicFetch('http://localhost:3000/200').then(data => {
  if (data.status === 200) {
    data.json().then(json => {
      helper('success', 'isomorphic-fetch 200 lib', 'rewrite', json);
    });
  } else {
    helper('error', 'isomorphic-fetch 200 lib', 'rewrite', 'NOT SUCCESSFUL');
  }
});

// REWRITES
//----------------------------
// Request
// request 305
// returns a 3xx and a resource to redirect to
rp('http://localhost:3000/305').then(data => {
  if (data.statusCode === 305) {
    helper('success', 'Request 305 lib', 'rewrite', data.body);
  } else {
    helper('error', 'Request 305 lib', 'rewrite', 'NO BODY');
  }
});

// Request
// isomorphic-fetch 305
// returns a 3xx and a resource to redirect to
isomorphicFetch('http://localhost:3000/305').then(data => {
  if (data.status === 305) {
    data.json().then(json => {
      helper('success', 'isomorphic-fetch 305 lib', 'rewrite', json);
    });
  } else {
    helper('error', 'isomorphic-fetch 305 lib', 'rewrite', 'NO BODY');
  }
});

// REDIRECTS
//----------------------------

// auto follow
// request 308
// this automatically will perminantly redirect to correct resource
rp('http://localhost:3000/308').then(data => {
  if (data.statusCode === 200) {
    helper('success', 'Request follow redirect lib', 'redirect', `status code ${data.statusCode}`);
  } else {
    helper('error', 'Request follow redirect lib', 'redirect', 'NO AUTO REDIRECT');
  }
});

// auto follow
// isomorphic-fetch 308
// this automatically will perminantly redirect to correct resource
isomorphicFetch('http://localhost:3000/308').then(data => {
  if (data.status === 200) {
    helper('success', 'isomorphic-fetch redirect lib', 'redirect', `status code ${data.status}`);
  } else {
    helper('error', 'isomorphic-fetch redirect lib', 'redirect', 'NO AUTO REDIRECT');
  }
});

// dont auto follow
// request 308
// this will not follow 308 but show body
rp({ url: 'http://localhost:3000/308', followRedirect: false }).then(data => {
  if (data.statusCode === 308) {
    helper('success', 'Request dont redirect lib', 'redirect', `status code ${data.statusCode} body: ${data.body}`);
  } else {
    helper('error', 'Request dont redirect lib', 'redirect', 'AUTO REDIRECTED');
  }
});

// dont auto follow
// isomorphic-fetch 308
// this will not follow 308 but show body
isomorphicFetch('http://localhost:3000/308', { redirect: 'manual' }).then(data => {
  if (data.status === 308) {
    data.json().then(json => {
      helper('success', 'isomorphic-fetch dont redirect lib', 'redirect', `status code ${data.status} body: ${JSON.stringify(json)}`);
    });
  } else {
    helper('error', 'isomorphic-fetch dont redirect lib', 'redirect', 'NO AUTO REDIRECT');
  }
});
