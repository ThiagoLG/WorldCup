import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

/**
 * Função utilizada para "sobrescrever" a estrutura de HTML padrão do dom, permitindo customizações
 * @returns Estrutura nova do HTML (dom) para ser interpreda pelo Next
 */
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <body className='bg-gray-900 bg-app bg-cover bg-no-repeat'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}