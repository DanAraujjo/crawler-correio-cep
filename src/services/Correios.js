import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import cheerio from 'cheerio';
// import readLineSync from 'readline-sync';

puppeteer.use(pluginStealth());

export default async ({ cep }) => {
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
  ];

  const options = {
    args,
    headless: true,
    ignoreHTTPSErrors: true,
    userDataDir: './tmp',
  };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.goto('http://www.buscacep.correios.com.br/sistemas/buscacep/');
  await page.waitFor(100);

  await page.type('input[name="relaxation"]', cep, {
    delay: 100,
  });

  await page.waitFor(100);
  await page.keyboard.press('Enter');

  await page.waitFor(500);

  const content = await page.content();
  const $ = cheerio.load(content);

  const objt = [];

  $(
    'body > div.back > div.tabs > div:nth-child(2) > div > div > div.column2 > div.content > div.ctrlcontent > table > tbody > tr'
  )
    .next()
    .each((_, tr) => {
      objt.push({
        rua: $(tr)
          .find('td')
          .eq(0)
          .text(),
        bairro: $(tr)
          .find('td')
          .eq(1)
          .text(),
        cidade: $(tr)
          .find('td')
          .eq(2)
          .text(),
        cep: $(tr)
          .find('td')
          .eq(3)
          .text(),
      });
    });

  await browser.close();

  return objt;
};
