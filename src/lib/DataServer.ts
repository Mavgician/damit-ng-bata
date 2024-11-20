import { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

interface fetchParams {
  method: string;
  body: BodyInit | undefined;
}

export const fetchParsed = async (url: string, fetchParams: fetchParams = {method: 'GET', body: undefined}) => {
  if (!fetchParams) return ({message: 'fetching'})
  const { method, body } = fetchParams

  try {
    return await fetch(url, {method: method, body}).then(data => data.json())
  } catch (error) {
    return NextResponse.json({message: 'Cannot parse response', stack: error}, { status: 500 })
  }
}

export const verifyUser = async (url: string, token: CookieListItem) => {
  const user = await fetch(
      'https://localhost:3000/api/user/verify',
      {
          method: 'POST',
          body: JSON.stringify({
              isLogin: true,
              token: token.value
          })
      }
  )

  return /* user.json() */
}