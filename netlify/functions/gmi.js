const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

const config = {
  width: 1280,
  height: 640,
  port: 3001,
  baseUrl: 'https://stage.analytics.upshot.io/share/gmi/',
}

exports.handler = async ({ queryStringParameters: qs }) => {
  if (!qs.wallet)
    return {
      statusCode: 500,
      body: 'Error: No wallet received.',
    }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: config.width, height: config.height },
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  })

  const page = await browser.newPage()

  try {
    const url = config.baseUrl + qs.wallet
    const result = await page.goto(url)

    await page.evaluateHandle('document.fonts.ready')
    await page.waitForSelector('#gmiResults')

    if (result.ok()) {
      const buffer = await page.screenshot()
      await browser.close()

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
      }
    }
  } catch (err) {
    await browser.close()

    return {
      statusCode: 500,
      body: 'Error: Unable to retrieve gmi.',
    }
  }
}
