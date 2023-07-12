import Document, { Html, Head, Main, NextScript } from 'next/document';
// это файл _document.tsx, который является частью next.js Это как враппер для всех страниц и позволяет нам добавлять теги в head  и т.д. 
// Это нельзя использовать в функциональных компонентах, поэтому мы используем классовый компонент

class AppDocument extends Document { // Чтобы все приложение получило пропсы которые тут буду передавать
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" /> 
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />  {/*  Это тег, который позволяет нам вставлять контент внутрь body */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
