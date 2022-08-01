import browser from "webextension-polyfill";
import { AllowedQueryParamPageType } from "provider-bridge-shared";

export default async function showExtensionPopup(
  url: AllowedQueryParamPageType
): Promise<browser.Windows.Window> {
  const { left = 0, top, width = 1920 } = await browser.windows.getCurrent();
  const popupWidth = 384;
  const popupHeight = 600;
  return browser.windows.create({
    url: `${browser.runtime.getURL("index.html")}?page=${url}`,
    type: "popup",
    left: left + width - popupWidth,
    top,
    width: popupWidth,
    height: popupHeight,
    focused: true,
  });
}
