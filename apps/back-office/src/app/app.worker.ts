import {
  AngularWebWorker,
  bootstrapWorker,
  OnWorkerInit,
  Callable,
} from 'angular-web-worker';
/// <reference lib="webworker" />

@AngularWebWorker()
export class AppWorker implements OnWorkerInit {
  a = 0;
  onWorkerInit() {
    console.log('Web worker is working');
  }

  @Callable()
  doSomeWork() {
    for (let index = 0; index < 10000000000; index++) {
      this.a += index;
    }
    console.log('finished web worker: ', this.a);
  }
}
bootstrapWorker(AppWorker);
