import test from 'ava';
import { startCrawling } from '../crawler';


test('starts crawl', t => {
  const url = 'http://www.lunametrics.com/blog/2017/02/02/unlimited­data­studio­reports/';
  startCrawling(url);
  t.pass();
})
