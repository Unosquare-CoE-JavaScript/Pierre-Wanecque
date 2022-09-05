import { fakeAsync, tick, flush, flushMicrotasks} from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

describe("Async Testing Examples", () => {

  it("Asynchronous test example with Jasmin done()", (done:DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it("Asynchronous test exmple - setTimeout", fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      console.log('running assertions setTimeout()');
      test = true;
    }, 1000);

    // tick calling with fakeAsync (clock gestion)
    //tick(1000);
    flush();
    expect(test).toBeTruthy();

  }));

  it("Asynchronous test example - plain Promise", fakeAsync(() => {
    let test = false;

    console.log('Creating Promise');

    // setTimeout(() => {
    //   console.log('first setTimeout()');
    // });
    //
    // setTimeout(() => {
    //   console.log('second setTimeout()');
    // });

    Promise.resolve().then(() =>{
      console.log('Promise evaluated successfully');
      return Promise.resolve().then(() =>{
          console.log('Promise 2 evaluated successfully');
          test = true;
        });
    });

    flushMicrotasks();
    console.log('running test');

    expect(test).toBeTruthy();
  }));

  it("Asynchronous test example -  Promise + setTimeout", fakeAsync(() => {
    let counter = 0;

    console.log('Creating Promise');

    Promise.resolve().then(() =>{
      console.log('Promise evaluated successfully');
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    console.log('running test');
    expect(counter).toBe(0);
    flushMicrotasks(); // only Micro task queu (promise)
    expect(counter).toBe(10);
    tick(1000);
    expect(counter).toBe(11);
  }));

  it("Asynchronous test example -  OBSERVABLE", fakeAsync(() => {
    let test = false;

    console.log('Creating Observable');
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);
    console.log('running test');
    expect(test).toBeTruthy();
  }));

});
