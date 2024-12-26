export default () => ({
    gnews: {
      apiKey: process.env.GNEWS_API_KEY,
      baseUrl: 'https://gnews.io/api/v4',
    },
    cache: {
      ttl: 3600, // 1 hour in seconds
    },
  });