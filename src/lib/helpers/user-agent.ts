export const isMobileUserAgent = (userAgent: string) => {
  const mobileKeywords =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  return mobileKeywords.test(userAgent);
};
