# HN Reader

## Scope

- [ ] Use the [HN API](https://github.com/HackerNews/API) to show a list of latest stories
- [ ] Stories to be shown in descending order, newest to oldest
- [ ] Each list item to have the title (which links to the story), author name & posted time
- [ ] display list item as soon as it's been fetched
- [ ] Infinite scroll: Scroll to the bottom loads earlier items
- [ ] Offline capability

### Initial thoughts

#### Stage 0

Had some spare time earlier and did a quick initial design mockup / component breakdown. These might change down the track but it's out of the way for now.

#### Stage 1: News Reader

Create a news reader, fetch a fixed number of stories. We'll be using the API directly. As mentioned in the [api docs](https://github.com/HackerNews/API), this is not the perfect API and just an in-memory data dump.

A solution to part of this exercise is actually mentioned in the docs:

> The newest page? Starts at item maxid and walks backward, keeping only the top level stories. Same for Ask, Show, etc.

ideas/notes:

- abstract away hacker news. Allow for potential other sources
- need to walk backwards after getting the latest item and render as soon as possible
- 3 layers:
  - UI 
  - Hackernews Reader App (core business logic)
  - Hacker News API client



#### Stage 2: Offline capabilities

Add offline capabilities, the user should be able to a list of stories.

Loose thoughts:

- review service worker that is bundled with CRA
- workbox is (one of) the service worker frameworks available. Ideally I'd craft something by hand, but should review where that project is at if I get in shortage of time
- review caching strategies & pick appropriate one (and clarify the choice). From the top of my mind we've got these (not exact names) `cache-first`, `stale-and-revalidate`, `network-then-cache`
- error / loading messages!

#### Stage 3: Infinite scroll

> The app should support infinite scroll (like a social media feed). Specifically, when the user reaches the bottom of the page, the app should fetch earlier items and display them.

Need to hook into the scroll event. Personally I'd classify this as a nice to have. Maybe a "load more" button & fetch 30 every time first?

If this were a project I work on with a team, I would push to rescope it with the suggestion above. Shipping a meaningful app would be:

a) being able to fetch the list and load more when requested. (We could ship a first version once this is done)
b) support offline capabilities.
c) Improve the UI & replace the load more button with "infinite scroll".

**open questions:**

- how do we define the length of first list of stories? Is that based on the viewport height, given that we want to load more on scroll? Maybe just start with a certain offset?
- todo: best practice for testing scoll functionality? Review Cypress setup from last year

#### Stage 4: improvements & TODOs

TBD

## Future improvements

This section contains a list of ideas that can be applied later on. I'll either identify areas that I'm not particularly happy with at the moment or areas that could be improved from a performance/architecture/feature set point of view.

- endless scroll: performance?
- preload

## Technology choices

### React & TypeScript

Although the app is quite small, it may prove to be a good opportunity to play around with newer APIs. Maybe even [Recoil](https://recoiljs.org/)

A vanilla JS might branch off later.

These projects are a good opportunity to brush up on my TS skills. TS also makes it easy to refactor and program to interfaces.

### Create React App

Chosen to get the boilerplate out of the way. CRA takes care of initialising the project so we can focus on building the application itself.

### Plain old CSS

The purpose of this application is building a HN reader using JavaScript. Styling is kept to a minimum.

Frameworks like CSS Modules, Emotion, Styled Components or Compiled can be explored should this application ever evolve. For now they're considered excessive.

---

# Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Documentation below is standard documentation from this project.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
