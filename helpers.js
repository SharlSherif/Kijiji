const blockedResourceTypes = ["image", "font", "css", "stylesheet"];

const skippedResources = [
  "doubleclick",
  "sharethrough",
  "cdn.api.twitter",
  "google-analytics",
  "googletagmanager",
  "google",
  "fontawesome",
  "facebook",
];
async function Intercept(page) {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const requestUrl = request._url.split("?")[0].split("#")[0];
    if (
      blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
      skippedResources.some((resource) => requestUrl.indexOf(resource) !== -1)
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  return page;
}

const clearFieldAndType = async (page, fieldID, text = "") => {
  try {
    await page.evaluate( (fieldID) => document.querySelector(fieldID).value = "", fieldID)
    await page.focus(fieldID);
    await page.keyboard.type(text, {delay:150});
    return true
  }
  catch(e) {
    console.error("Something went wrong while typing in field : "+fieldID)
    throw new Error(e)
  }
};

module.exports = { Intercept,clearFieldAndType };
