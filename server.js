import http from 'http';
import queryString from 'query-string';

const server = http.createServer((request, response) => {
    console.log(request.url);
    let requestInfo = {
        url: request.url,
        method: request.method,
        contentType: request.headers['content-type']
    };

    response.writeHead(200, { "Content-Type": "application/json" });

    if (request.method == 'GET') {
        response.end(JSON.stringify(requestInfo));
    } else if (request.method == 'POST') {
        let body = [];
        request.on('data', chunk => {
            body += chunk;
        }).on('end', () => {
            try {
                if (request.headers['content-type'] === "application/json")
                    requestInfo.body = JSON.parse(body);
                else if (request.headers['content-type'] === "application/x-www-form-urlencoded")
                    requestInfo.body = queryString.parse(body.toString());
                else
                    requestInfo.body = body.toString();
                response.end(JSON.stringify(requestInfo));
            } catch (error) {
                console.log(error);
            }
        });
    }
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));