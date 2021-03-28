let buildStatus = "ready";

exports.handler = async (event) => {
  if (event.httpMethod === "POST") {
    console.log("POST Request from " + event["headers"]["client-ip"]);

    if (event.body.length > 0) {
      const body = JSON.parse(event.body);
      if (body.state) {
        buildStatus = body.state;
      }
    }

    return { statusCode: 200, body: "OK" };
  }

  if (event.httpMethod === "GET") {
    console.log("GET Request from " + event["headers"]["client-ip"]);

    return { statusCode: 200, body: buildStatus };
  }
};
