# jNewsApi

jNewsApi is a fake news API created by Joshua Briceno. This API allows you to search for news articles based on various criteria.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/jnewsapi.git
    cd jnewsapi
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add your GNews API key:
    ```env
    GNEWS_API_KEY=your_gnews_api_key
    ```

## Usage

### Running the API

To start the API in development mode, run:
```sh
npm run start:dev
```

API Documentation
The API documentation is available at http://localhost:3000/api-docs once the server is running.

API Endpoints
Search News
`URL: /news/search`
Method: POST
Description: Search news articles based on search criteria.

Request Payload Object
```json
{
  "q": "technology",
  "lang": "en",
  "country": "us",
  "max": 10
}
```

can also include for get the author or source of the information.

```json 
{
    ...
    "source": "Reuters"
}
```
Response Object

```json
[
    {
        "title": "Article Title",
        "description": "Article Description",
        "content": "Article Content",
        "url": "https://example.com/article",
        "image": "https://example.com/image.jpg",
        "publishedAt": "2023-10-01T00:00:00Z",
        "source": {
        "name": "Source Name",
        "url": "https://example.com"
        }
    }
    ]
```


API Endpoints
Search Article title
`URL: /news/article`
Method: POST
Description: Search news article based on title.



Request Payload Object
```json
{
    "title": "Christmas Eve pub quiz 2024: test your general knowledge with these 20 questions"
}
```

Response Object

```json
{
    "title": "Christmas Eve pub quiz 2024: test your general knowledge with these 20 questions",
    "description": "Put down the wrapping paper and take a break with our little festive quiz",
    "content": "Something went wrong, please try again later.\nInvalid email Something went wrong, please try again later.\nSign up for our daily newsletter to get the day's biggest stories sent direct to your inbox\nSomething went wrong, please try again later.\nSign u... [785 chars]",
    "url": "https://www.manchestereveningnews.co.uk/news/uk-news/christmas-eve-pub-quiz-2024-30649340",
    "image": "https://i2-prod.manchestereveningnews.co.uk/incoming/article30651804.ece/ALTERNATES/s1200/0_JS355236457.jpg",
    "publishedAt": "2024-12-24T17:47:28Z",
    "source": {
        "name": "Manchester Evening News",
        "url": "https://www.manchestereveningnews.co.uk"
    }
}
```