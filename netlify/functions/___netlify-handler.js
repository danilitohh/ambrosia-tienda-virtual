const { createRequestHandler } = require('@netlify/plugin-nextjs');

const handler = createRequestHandler({
  buildId: process.env.NETLIFY_NEXT_BUILD_ID,
  distDir: '.next',
});

exports.handler = handler; 