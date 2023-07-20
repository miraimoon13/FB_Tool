const puppeteer = require("puppeteer-core");
const assert = require("assert");
const {
  scrollPageToTop,
  scrollPageToBottom,
} = require("puppeteer-autoscroll-down");
const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const goto = async (
  page,
  url,
  options = { timeout: 90000, waitUntil: "networkidle2" }
) => {
  try {
    await page.goto(url, options);
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

const waitForSelector = async (page, selector, options = { timeout: 6000 }) => {
  try {
    await page.waitForSelector(selector, options);
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const waitForTimeout = async (page, timeout) => {
  try {
    await page.waitForTimeout(timeout);
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const scrollOptions = {
  size: 250,
  delay: 700,
  stepsLimit: 10,
};

//str random -done
async function viewStr(page) {
  try {
    const sltStr =
      'div > div[aria-label][role="region"] > [style] > div > [aria-hidden="false"] > div > div > div > [aria-label][role="link"] > div';
    const nextStr = `div[role="banner"] > div > div > span > [aria-hidden="false"] > div`;
    await page.waitForSelector(sltStr);
    console.log("đợi click str");
    const elmSTR = await page.$$(sltStr);
    const randomIndex = Math.floor(Math.random() * elmSTR.length);
    console.log("random ngẫu nhiên", randomIndex);
    elmSTR[randomIndex].click(); //click TD
    await page.waitForTimeout(15000); //td
    console.log("333 viewed story");
    //tắt str
    const nextStrs = await page.$(nextStr);
    console.log("đang đợi....");
    nextStrs.click();
    console.log("66 đã click X");
    await delay(2000);
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log(e);
  }
}
//xem video-done
async function watchVideo(page) {
  try {
    const viewVideoSelector = `div[aria-hidden="false"]> div > div > [aria-label="Facebook"] > ul > li > span > div `;
    const playButtonSelector = `div > div> div > div > [data-instancekey] > [data-visualcompletion="ignore"]`;

    await delay(2000);
    await page.waitForSelector(viewVideoSelector);
    await delay(2000);
    const watchs = await page.$$(viewVideoSelector);
    watchs[1].click();
    console.log("Clicked watch");

    await delay(2000);
    await scrollPageToBottom(page, scrollOptions);
    console.log("Scrolled to bottom");
    await scrollPageToTop(page, scrollOptions);
    console.log("Scrolled to top");
    await delay(4000);
    const playWatch = await page.$$(playButtonSelector);
    playWatch[0].click();
    console.log("Clicked playButton");
    await page.waitForTimeout(20000);
    console.log("Waiting for ... seconds");
    await delay(10000);
    //close X video
    const closeVd = `div[aria-labelledby][role="dialog"] > div > [aria-hidden] > div> [aria-hidden] > div > div> [aria-label]`;

    const closeVdElm = await page.$(closeVd);
    if (closeVdElm) {
      await page.waitForSelector(closeVd);
      await delay(2000);

      const closeVdElms = await page.$(closeVd);

      closeVdElms.click();
      console.log("Đã click vào x");
    }
    await delay(5000);
    await delay(2000);
    await scrollPageToBottom(page, scrollOptions);
    console.log("Scrolled to bottom");
    await scrollPageToTop(page, scrollOptions);
    console.log("Scrolled to top");
    await delay(4000);
    await page.goBack();
    await page.goBack();
    await delay(4000);

    console.log("Navigated back");
  } catch (e) {
    console.log(e);
  }
}

//đăng nhâp
const login = async (page, email, password) => {
  await page.goto("https://facebook.com/");
  await page.waitForSelector('input[id="email"]');

  await page.type('input[id="email"]', email);
  await page.type('input[id="pass"]', password);
  await page.keyboard.press("Enter");

  await delay(9000);

  console.log("Đăng nhập thành công");
  return true;
};

// Hàm kiểm tra trang đã đăng nhập
const isLogged = async (page) => {
  try {
    await page.waitForSelector(`[name= "login" ]`, { timeout: 5000 });
    return false; // Chưa đăng nhập
  } catch (error) {
    return true; // Đã đăng nhập
  }
};
(async () => {
  let br = null;
  try {
    const profileId = "64b50784b1cb505a206d8bc6";
    const proxy = {
      mode: "none",
      host: "",
      port: 1,
      username: "",
      password: "",
    };
    const response = await hidemyacc.start(profileId);
    assert(response);

    const wsUrl = response.data.wsUrl;

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      defaultViewport: null,
      slowMo: 60,
      timeout: 120000,
    });
    assert(browser);
    br = browser;
    const page = await browser.newPage();
    // Mở trang web
    await page.goto("https://facebook.com/");
    await page.waitForTimeout(5000);

    // Kiểm tra trang đã đăng nhập
    const isAlreadyLogged = await isLogged(page);
    console.log("Kiểm tra trang đăng nhập");
    // Nếu chưa đăng nhập thì gọi hàm login
    if (!isAlreadyLogged) {
      console.log("Trang chưa đn");
      await delay(2000);
      await login(page, "gmail", "passs@");
      console.log("đã đn thành công");
    }

    // xem video
    await watchVideo(page);
    await delay(2000);

    const lableChild = `[role="main"] div[aria-labelledby] [data-visualcompletion="ignore-dynamic"] div[role="button"][aria-label] > div i[data-visualcompletion="css-img"]`;
    // //like
    const childLike = await page.$$(lableChild);
    if (childLike.length > 1) {
      await clickAndProcess(childLike[0]);
      console.log("Liked");
      await scrollPageToBottom(page, scrollOptions);
      await delay(1000);
      await scrollPageToTop(page, scrollOptions);
      await delay(3000);
    } else {
      console.log("Không tìm thấy đủ số phần tử con từ lableChild");
    }
    // // xem str
    await delay(2000);
    await viewStr(page);
    await delay(2000);
    // //cmt
    // const childCmt = await page.$$(lableChild);
    // if (childCmt.length > 1) {
    //   await clickAndProcess(childCmt[1]);

    //   const typeCm = `[role="presentation"] > div >div > [data-visualcompletion="ignore"]`;
    //   await delay(2000);
    //   console.log("1");
    //   await page.waitForSelector(typeCm);
    //   await delay(2000);
    //   console.log("2");

    //   const typeCmtE = await page.$$(typeCm);
    //   await delay(2000);
    //   console.log("3");

    //   typeCmtE[0].click();
    //   console.log("đã click cmt");
    //   await page.type(typeCm, " :>");
    //   await page.waitForTimeout(3000);
    //   console.log("đã nhập cmt");

    //   await page.keyboard.press("Enter");
    //   await delay(9000);
    // //đóng cmt
    // const closeCmt = `div[aria-labelledby][role="dialog"] > div > [aria-hidden] > div> [aria-hidden] > div > div> [aria-label]`;
    // const closeCmtElement = await page.$(closeCmt);

    // if (closeCmtElement) {
    //   await page.waitForSelector(closeCmt);
    //   await delay(2000);
    //   const closeCmts = await page.$(closeCmt);
    //   closeCmts.click();
    //   console.log("Đã click vào x");
    // }
    // await delay(5000);

    //   //vừa lướt vừa like
    //   const childLike = await page.$$(lableChild);
    //   if (childLike.length > 1) {
    //     await scrollPageToBottom(page, scrollOptions);
    //     await delay(3000);
    //     await clickAndProcess(childLike[12]);
    //     console.log("Liked");
    //     await scrollPageToBottom(page, scrollOptions);
    //     await scrollPageToTop(page, scrollOptions);
    //     await delay(3000);
    //   } else {
    //     console.log("Không tìm thấy đủ số phần tử con từ lableChild");
    //   }
    // } else {
    //   console.log("Không tìm thấy đủ số phần tử con từ lableChild");
    // }

    //like - cmt
    async function clickAndProcess(childElement) {
      await childElement.click();
      console.log("Đã click vào phần tử con");
      const closestParent = await page.evaluateHandle(
        (element, selector) => {
          return element.closest(selector);
        },
        childElement,
        'div[role="button"]'
      );

      const closestParentElement = await closestParent.asElement();
      if (closestParentElement) {
        await closestParentElement.click();
        console.log("Đã click vào phần tử cha gần nhất");
      } else {
        console.log("Không tìm thấy phần tử cha từ lableChild");
      }
    }

    // xem thông báo
    const viewNoti = `[role="banner"] > div > [role="navigation"] > div > span`;
    await page.waitForSelector(viewNoti);
    const viewNotifi = await page.$$(viewNoti);
    await viewNotifi[0].click();
    await delay(2000);
    console.log("1.Notifi");

    const viewDetailNoti = `div > [tabindex="-1"] > div > div > [aria-label][role="dialog"] > div > div > div > div > div > div > [aria-label][role="grid"] > div > [role="row"] > [data-visualcompletion="ignore-dynamic"][role="none"] > [role="gridcell"] `;
    await page.waitForSelector(viewDetailNoti);
    const viewDetailNotis = await page.$$(viewDetailNoti);
    await viewDetailNotis[8].click();
    await delay(9000);
    console.log("Readed notifi");
    await page.goBack();
    await delay(2000);

    //div > [tabindex="-1"] > div > div > [aria-label][role="dialog"] > div > div > div > div > div > div > [aria-label][role="grid"] > div > [role="row"] > [data-visualcompletion="ignore-dynamic"][role="none"] > [role="gridcell"]
  } catch (err) {
    console.error("=", err);
  } finally {
    await br?.close();
    console.log("đã đóng!");
  }
})();
