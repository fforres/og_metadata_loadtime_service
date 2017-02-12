import Nightmare from 'nightmare';
import Timer from '../timer';

const nightmare = Nightmare();

export const startLoading = (url) =>  new Promise ((resolve, reject) => {
  const timer = new Timer();
  timer.start();
  nightmare
    .goto(url)
    .wait()
    .run(() => {
      timer.stop();
      const time = timer.calculate();
      resolve(time);
    })
    .catch(function (error) {
      console.error('Search failed:', error);
    });
})
export default startLoading;
