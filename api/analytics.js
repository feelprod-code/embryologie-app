import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      return res.status(500).json({ error: "Missing GOOGLE_SERVICE_ACCOUNT_JSON" });
    }

    const creds = JSON.parse(serviceAccountJson);
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '545971738';

    // 1. Sign JWT using RS256 with the built-in crypto module
    const signJwt = () => {
      const header = { alg: 'RS256', typ: 'JWT' };
      const now = Math.floor(Date.now() / 1000);
      const claim = {
        iss: creds.client_email,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        aud: creds.token_uri,
        exp: now + 3600,
        iat: now
      };

      const base64UrlEncode = (str) => {
        return Buffer.from(str)
          .toString('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      };

      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedClaim = base64UrlEncode(JSON.stringify(claim));
      const signatureInput = `${encodedHeader}.${encodedClaim}`;

      const signer = crypto.createSign('RSA-SHA256');
      signer.update(signatureInput);
      const signature = signer.sign(creds.private_key);
      const encodedSignature = base64UrlEncode(signature);

      return `${signatureInput}.${encodedSignature}`;
    };

    // 2. Fetch Access Token
    const jwt = signJwt();
    const tokenRes = await fetch(creds.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });
    
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return res.status(500).json({ error: "Failed to get access token", details: errText });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 3. Setup dates based on timeframe
    const { timeframe } = req.query;
    let startDate = '30daysAgo';
    let endDate = 'today';
    let dimensionName = 'date'; // YYYYMMDD

    if (timeframe === 'week') {
      startDate = '7daysAgo';
    } else if (timeframe === 'month') {
      startDate = '30daysAgo';
    } else if (timeframe === 'year') {
      startDate = '365daysAgo';
      dimensionName = 'yearMonth'; // YYYYMM
    }

    // 4. Run Report
    const reportRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: dimensionName }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName }, desc: false }]
      })
    });

    if (!reportRes.ok) {
      const errText = await reportRes.text();
      return res.status(500).json({ error: "Failed to fetch GA4 report", details: errText });
    }

    const reportData = await reportRes.json();

    // 5. Structure rows
    const rows = (reportData.rows || []).map(row => {
      return {
        dimension: row.dimensionValues[0].value,
        activeUsers: parseInt(row.metricValues[0].value, 10),
        pageViews: parseInt(row.metricValues[1].value, 10)
      };
    });

    return res.status(200).json({
      timeframe,
      propertyId,
      rows
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
