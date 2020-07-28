# HN Reader

Visit [https://hn-reader.vercel.app/](https://hn-reader.vercel.app/)

## Scripts

- `yarn start` run the application in development mode. Available in the browser at [http://localhost:3000](http://localhost:3000)
- `yarn build` create a production build of the application
- `yarn test` run the tests, ready for deployment

## Future improvements

This section contains a list of ideas that can be applied later on. I'll either identify areas that I'm not particularly happy with at the moment or areas that could be improved from a performance/architecture/feature set point of view.

Todo:

- [ ] integration test for app
- [ ] test for scrolling

Improvements to be made:

- [ ] tests for UI components - maybe visual snapshots?
- [ ] Service worker improvements. See [commit](https://github.com/driesg/hn-reader/commit/a2b2a1bc8787b7ecf9ef621a946b499953cc0c38)
- [ ] Create a visual indicator for the user that they are offline
- [ ] unit test `Story.ts`
- [ ] ASK HN is missing because their API response does not contain a `url` field. Should it be included?

## Technology choices

### React & TypeScript

Although the app is quite small, it may prove to be a good opportunity to play around with newer APIs. ~Maybe even [Recoil](https://recoiljs.org/)~ (not required)

A vanilla JS might branch off later.

These projects are a good opportunity to brush up on my TS skills. TS also makes it easy to refactor and program to interfaces.

### Create React App

Chosen to get the boilerplate out of the way. CRA takes care of initialising the project so we can focus on building the application itself.

CRA's original readme is available [here](./CRA_README.md)

### Plain old CSS

The purpose of this application is building a HN reader using JavaScript. Styling is kept to a minimum.

Frameworks like CSS Modules, Emotion, Styled Components or Compiled can be explored should this application ever evolve. For now they're considered excessive.

### Packages

- [Jest Fetch Mock](https://www.npmjs.com/package/jest-fetch-mock) is an easy way to mock fetch calls for testing purposes.
- [lodash throttle](https://lodash.com/docs/4.17.15#throttle) function that allows us to throttle API calls. Rather than writing this utility function ourselves, we include a battletested version
