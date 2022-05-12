exports.handler = async function (event, context) {
  console.log({ body: event.body, qs: event.queryStringParameters })

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  }
}
