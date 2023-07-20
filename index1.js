const puppeteer = require("puppeteer-core");
const assert = require("assert");
const {
  scrollPageToTop,
  scrollPageToBottom,
} = require("puppeteer-autoscroll-down");
const Hidemyacc = require("./hidemyacc");
const { get } = require("http");
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
function RandomCmt() {
  const comments = [
    "Comment 1",
    "Comment 2",
    "Comment 3",
    "Comment 4",
    "Comment 5",
  ];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return [comments[randomIndex]];
}
//TH mobie
const simTouch = async (page, selector) => {
  try {
    const eh = await page.$(selector);
    if (eh) {
      const boundingBox = await eh.boundingBox();
      await page.touchscreen.tap(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );
      return true;
    }
    throw new Error();
  } catch {
    return false;
  }
};
async function scrollTo(x, y) {
  await page.evaluate(
    (_x, _y) => {
      window.scrollTo(parseInt(_x || 0, 10), parseInt(_y || 0, 10));
    },
    x,
    y
  );
}
const scrollOptions = {
  size: 250,
  delay: 700,
  stepsLimit: 8,
};

//cuộn và chạm vào vị trí phần tử cần chạm
const simTouch2 = async (page, selector, index) => {
  try {
    const eh = await page.$$(selector);
    if (eh && eh.length > 0) {
      const boundingBox = await eh[index].boundingBox();
      console.log("111", boundingBox);
      await page.touchscreen.tap(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );

      return boundingBox;
    }
    throw new Error();
  } catch {
    return false;
  }
};

//cmt-done
async function commentRandom(page) {
  try {
    await page.evaluate(() => {
      window.scroll(0, 1);
    });
    await delay(1000);
    const elmCmtSelector = `div[data-mcomponent="MContainer"] > div[data-focusable="true"] > div[data-mcomponent="TextArea"] .native-text`;
    await page.waitForSelector(elmCmtSelector);
    const elmCmts = await page.$$(elmCmtSelector);
    await page.waitForTimeout(2000);

    const boundingBox = await elmCmts[2].boundingBox(); // cuộn đến vị trí cmt
    await positionScroll(page, 0, boundingBox.y);
    console.log("Đang đợi cmt");
    await page.waitForTimeout(2000);

    await simTouch2(page, elmCmtSelector, 2); //nhấn vào cmt
    await delay(3000);
    console.log("Clicked cmt");
    await delay(1000);

    const elmCmtType = `[data-mcomponent="MContainer"] > [data-mcomponent="MContainer"] > [data-mcomponent="MContainer"] > [data-mcomponent="MContainer" ]>  [data-mcomponent="MContainer"] > [data-input-box-max-suggest-entity-ac]`;
    await page.waitForSelector(elmCmtType);
    await page.waitForTimeout(2000);
    console.log("Đang đợi type cmt");
    await simTouch(page, elmCmtType);
    console.log("11111");

    await simTouch2(page, elmCmtType, 0);
    await page.waitForTimeout(2000);

    console.log("Typed cmt");
    const comment = RandomCmt().join("");
    await page.type(elmCmtType, comment);
    // await page.type(elmCmtType, RandomCmt());

    await delay(3000);
    const eleSendSelector =
      'div[id="screen-root"] > div[data-adjust-on-keyboard-shown="true"] > div[data-shift-on-keyboard-shown="true"] > div[data-mcomponent="MContainer"] div:not(.hidden) > div > div[role="button"]';
    await page.waitForSelector(eleSendSelector);
    console.log("Đang đợi send cmt");
    await simTouch2(page, eleSendSelector, 0);
    await page.waitForTimeout(2000);
    console.log("Sended cmt");
  } catch (e) {
    console.error(`Đã xảy ra lỗi: ${e}`);
  }
}
//str random
async function viewStr(page) {
  try {
    await page.evaluate(() => {
      window.scroll(0, 0);
    });
    const sltStr =
      'div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[role="button"][aria-label][aria-hidden]';
    const nextStr =
      'div[data-tracking-duration-id] > [role][data-actual-height][data-mcomponent="MContainer"][data-type="container"]';
    await page.waitForSelector(sltStr);
    console.log("đợi click str");
    const elmSTR = await page.$$(sltStr);
    const randomIndex = Math.floor(Math.random() * elmSTR.length);
    console.log("random ngẫu nhiên", randomIndex);
    elmSTR[randomIndex].click(); //click TD
    await page.waitForTimeout(22000); //td
    //tắt str
    const nextStrs = await page.$$(nextStr);
    console.log("đang đợi....");
    nextStrs[2].click();
    await delay(1000);
    console.log("66 đã click X");
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log(e);
  }
}

// //lướt newfeeds, xem thông báo, xem video

async function performClickActions(page, elementSelector, clickIndexes) {
  await page.evaluate(() => {
    window.scroll(0, 0);
  });
  await page.waitForSelector(elementSelector);
  for (const index of clickIndexes) {
    await page.waitForTimeout(2000);
    const touchResult = await simTouch2(page, elementSelector, index);
    console.log("11111");
    if (touchResult) {
      console.log("bounding box:", touchResult);
      await delay(2000);
      await page.evaluate((touchResult) => {
        window.scrollTo({
          top: touchResult.y,
          behavior: "auto",
          duration: 10000,
        });
      }, touchResult);
    }
    await delay(5000);
    try {
      await scrollPageToBottom(page, scrollOptions);
      await delay(3000);
      await scrollPageToTop(page, scrollOptions);
      await delay(3000);
      // await page.goBack();
    } catch (error) {
      console.error(`Đã xảy ra lỗi khi cuộn trang: ${error}`);
    }
    await delay(5000);
    await page.goBack();
    console.log("done", index);
  }
}
//cuộn đến vị trí x,y
async function positionScroll(page, x, y) {
  await page.evaluate((targetY) => {
    return new Promise((resolve) => {
      const start = window.scrollY;
      const target = targetY;
      const duration = 1000; // Thời gian cuộn (milliseconds)
      const easing = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); // Hàm easing, Cuộn chậm ở đầu và cuối, và nhanh hơn ở giữa.
      let currentTime = 0;

      const animateScroll = () => {
        currentTime += 16;
        const progress = currentTime / duration;
        const easedProgress = easing(progress);

        const distance = target - start;
        const newY = start + distance * easedProgress;
        window.scrollTo(0, newY); // chỉ muốn cuộn dọc (scrollY)

        if (currentTime < duration) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };
      animateScroll();
    });
  }, y);
}
//like random
async function reactLike1(page) {
  try {
    await delay(2000);
    const elmLikeSelector =
      'div[data-mcomponent="MContainer"][data-type="vscroller"] > div[data-mcomponent="MContainer"][data-type="container"] > div[data-long-click-action-id]';
    await page.waitForSelector(elmLikeSelector);
    const elmLike = await page.$$(elmLikeSelector);
    const randomIndex = Math.floor(Math.random() * Math.min(elmLike.length, 3)); // Random trong khoảng 6 phần tử đầu tiên của elmLike
    console.log("Random like: ", randomIndex);

    await page.waitForTimeout(2000);
    console.log("đợi..");
    // Lấy vị trí của phần tử
    const boundingBox = await elmLike[randomIndex].boundingBox();
    await positionScroll(page, 0, boundingBox.y);
    await page.waitForTimeout(1000);

    await simTouch2(page, elmLikeSelector, randomIndex);
    await page.waitForTimeout(2000);
    console.log("đã like");
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}

//xem video -done
async function watchVideo(page) {
  try {
    await page.evaluate(() => {
      window.scroll(0, 0);
    });
    const viewVideoSelector =
      'div[data-mcomponent="MContainer"] > div[role="button"] div[data-mcomponent="ServerTextArea"][data-type="text"] .fl.ac.am .native-text';
    const playButtonSelector =
      'div[data-mcomponent="MScreen"] > div[data-type="vscroller"]  > div[data-mcomponent="MContainer"] > div[data-focusable="true"] div[data-on-video-finished-action]';

    await delay(2000);
    await page.waitForSelector(viewVideoSelector);
    await delay(2000);
    await simTouch2(page, viewVideoSelector, 4);
    console.log("Clicked viewVideo");

    await delay(2000);
    await scrollPageToBottom(page, scrollOptions);
    console.log("Scrolled to bottom");
    await scrollPageToTop(page, scrollOptions);
    console.log("Scrolled to top");
    await delay(4000);

    await simTouch2(page, playButtonSelector, 0);
    console.log("Clicked playButton");
    await page.waitForTimeout(20000);

    console.log("Waiting for 2 seconds");
    await delay(2000);
    await page.goBack();
    console.log("Navigated back");
  } catch (e) {
    console.log(e);
  }
}
//xem thông báo chi tiết
async function viewNotiDetail(page) {
  await page.evaluate(() => {
    window.scroll(0, 0);
  });
  const eleNoti =
    'div[data-mcomponent="MContainer"] > div[role="button"] div[data-mcomponent="ServerTextArea"][data-type="text"] .fl.ac.am .native-text';
  await page.waitForSelector(eleNoti);
  await simTouch2(page, eleNoti, 5);
  await page.waitForTimeout(2000);

  const eleNoti1 = `div[data-mcomponent="MContainer"][data-type="vscroller"] > [aria-label]`; // in ra các phần tử thông báo
  await page.waitForSelector(eleNoti1);
  await simTouch2(page, eleNoti1, 5);
  await delay(1000);
  await page.waitForTimeout(6000);

  await page.goBack();
  console.log("đã back1");
  await page.goBack();
  console.log("đã back2");
}
//đăng nhâp
const login = async (page, email, password) => {
  await page.goto("https://m.facebook.com/");
  await page.waitForSelector('input[id="m_login_email"]');

  await page.type('input[id="m_login_email"]', email);
  await page.type('input[id="m_login_password"]', password);
  await page.keyboard.press("Enter");

  await delay(9000);
  const btnSaveInfo = `form[method][action] > ._2pis > button[type]`;
  const btnSaveInfos = await page.$(btnSaveInfo);

  if (btnSaveInfos) {
    const btnSaveInfos = await page.$(btnSaveInfo);
    await page.waitForSelector(btnSaveInfos);
    await page.click(btnSaveInfos);
  }

  console.log("Đăng nhập thành công");
  return true;
};
// Hàm kiểm tra trang đã đăng nhập
const isLogged = async (page) => {
  try {
    // Lấy danh sách các cookie
    const cookies = await page.cookies();
    console.log("Danh sách các cookie:");

    // Kiểm tra từng cookie
    for (const cookie of cookies) {
      console.log(`${cookie.name}: ${cookie.value}`);
      if (cookie.name === "c_user") {
        console.log("Đã đăng nhập");
        return true;
      }
    }

    console.log("Chưa đăng nhập");
    return false;
  } catch (e) {
    console.error("Đã xảy ra lỗi:", e);
    return false;
  }
};
(async () => {
  let br = null;
  try {
    const profileId = "64abce9bb1cb505a203fe2b6";
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
    await page.goto("https://m.facebook.com/");
    await page.waitForTimeout(5000);
    // Kiểm tra trang đã đăng nhập
    const isAlreadyLogged = await isLogged(page);
    // Nếu chưa đăng nhập thì gọi hàm login
    if (!isAlreadyLogged) {
      await delay(2000);
      await login(page, "111@gmail.com", "111@");
    }

    //like random
    await delay(1000);
    await reactLike1(page);
    await delay(1000);

    // // xem str
    await delay(1000);
    await viewStr(page);
    await delay(1000);
    //CMT
    await delay(1000);
    await commentRandom(page);
    await delay(2000);
    await page.goBack();
    await delay(2000);
    // xem video
    await watchVideo(page);
    await delay(2000);

    // // luot newfeed
    const elementFr =
      'div[data-mcomponent="MContainer"] > div[role="button"] div[data-mcomponent="ServerTextArea"][data-type="text"] .fl.ac.am .native-text';
    const clickIndexes = [5, 4, 2]; //4: xem video, 2: xem lời mời kb, 5: xem thông báo

    try {
      await performClickActions(page, elementFr, clickIndexes);
    } catch (error) {
      console.error(`Đã xảy ra lỗi trong quá trình thực thi: ${error}`);
    }
    await delay(5000);

    //xem thông báo chi tiết
    await viewNotiDetail(page);
    await delay(5000);
  } catch (err) {
    console.error("=", err);
  } finally {
    await br?.close();
    console.log("đã đóng!");
  }
})();
