import autoCert from "anchor-pki/auto-cert/integrations/next"

const withAutoCert = autoCert({
  enabledEnv: "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withAutoCert(nextConfig);