import { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

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

export const verifyUser = async (req: NextRequest, token: CookieListItem) => {
  const user = await fetch(
      `${req.nextUrl.origin}/api/user/verify`,
      {
          method: 'POST',
          body: JSON.stringify({
              isLogin: true,
              token: token.value
          })
      }
  )

  return user.json()
}