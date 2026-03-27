import { AppProps } from "next/app"
import React from "react"
import { Analytics } from "@vercel/analytics/next"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
