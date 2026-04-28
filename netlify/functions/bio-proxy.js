// netlify/functions/bio-proxy.js
// Server-side proxy for biological APIs that block direct browser (CORS) requests.
// Currently handles: Open Targets (GraphQL), ChEMBL (REST)
// To add a new CORS-blocked source: add its target name to ALLOWED_TARGETS below.

const ALLOWED_TARGETS = ['opentargets', 'chembl'];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { target, url, method = 'GET', body, headers: reqHeaders } = payload;

  // Security: only allow known biological API targets
  if (!target || !ALLOWED_TARGETS.includes(target)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: `Target '${target}' not in allowed list: ${ALLOWED_TARGETS.join(', ')}` }),
    };
  }

  // Security: only allow requests to known biological API domains
  const ALLOWED_DOMAINS = [
    'api.platform.opentargets.org',
    'www.ebi.ac.uk',
  ];
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid URL' }) };
  }

  if (!ALLOWED_DOMAINS.some(d => parsedUrl.hostname === d)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: `Domain '${parsedUrl.hostname}' not in allowed list` }),
    };
  }

  try {
    const fetchOptions = {
      method,
      headers: reqHeaders || { 'Content-Type': 'application/json' },
    };
    if (body && method !== 'GET') {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Upstream error ${response.status} from ${target}` }),
      };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: `Proxy fetch failed: ${err.message}` }),
    };
  }
};
