import App from './App';

const app = new App();

app.boot()
  .then(() => {
    app.setup();
    app.run();
  });
