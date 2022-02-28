/* eslint-disable @next/next/no-document-import-in-page */
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { InitializeColorMode } from 'theme-ui'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    console.log({ ENV: process.env })

    const mouseFlow = (
      <script
        dangerouslySetInnerHTML={{
          __html: `
    window._mfq = window._mfq || [];
    (function() {
      var mf = document.createElement("script");
      mf.type = "text/javascript"; mf.defer = true;
      mf.src = "//cdn.mouseflow.com/projects/${process.env.NEXT_PUBLIC_MOUSEFLOW_ID}.js";
      document.getElementsByTagName("head")[0].appendChild(mf);
    })();
    `,
        }}
      />
    )

    return (
      <Html lang="en">
        <Head />
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
          {process.env.NODE_ENV !== 'development' && mouseFlow}
        </body>
      </Html>
    )
  }
}
