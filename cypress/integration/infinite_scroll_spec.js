/* eslint-disable no-undef */

/*
 * The test below is focused on testing the scroll behaviour.
 * In order to test this behaviour as easy as possible, we stub out the network
 * calls. This allows the app & data to load fast enough for Cypress to execute
 *
 */

// TODO this magic number 30 should be configurable.
// idea: pass in via environment to both the app and cypress
const INITIAL_STORIES = 30;

describe("Story list scrolling test test", () => {
  let id = 0;
  function increaseAndReturn() {
    return id++;
  }

  it("successfully loads", () => {
    cy.visit("/");
    cy.get(".hn-reader .story-list-title").contains("# Hacker News Story List");
  });

  it("loads more items when scrolling to the bottom", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win, "fetch")
          .callThrough()
          // Stub the maxitem call
          .withArgs("https://hacker-news.firebaseio.com/v0/maxitem.json")
          .resolves(
            Cypress.Promise.resolve({
              ok: true,
              json: () => "9000",
              status: 200,
            }).delay(500)
          )
          // stub all calls to items
          .withArgs(
            Cypress.sinon.match(
              new RegExp(
                /^https:\/\/hacker-news\.firebaseio\.com\/v0\/item\/\d+\.json$/
              )
            )
          )
          .resolves(
            Cypress.Promise.resolve({
              ok: true,
              status: 200,
              json: () => ({
                by: "Aer Parris",
                time: 1595931102,
                id: id, // avoid react key conflicts. Not guaranteed
                title: `How to Create Group Norms - v${increaseAndReturn()}`,
                type: "story",
                url: "https://doist.com/blog/group-norms-team-communication/",
              }),
            }).delay(1000) // to ensure the loading indicator is at least visible once
          );
      },
    });

    // Assertion to check if the app has loaded
    cy.get(".hn-reader .story-list-title").contains("# Hacker News Story List");

    // The loading indicator will be visible initially, then be hidden when all // the data arrives. This will happen fast because we cut out the network
    cy.get(".loading-indicator").should("be.visible");
    cy.get(".loading-indicator").should("not.be.visible");

    // Verify we've loaded the inital number of stories
    cy.get(".hn-reader .story-list")
      .children()
      .should("have.length", INITIAL_STORIES);

    // scroll towards an element on the bottom of the page
    cy.get(".story-list li:nth-child(28)")
      .scrollIntoView({ duration: 3000 })
      .should("be.visible");

    // assert new articles were loaded
    cy.get(".hn-reader .story-list")
      .children()
      .should("have.length.above", INITIAL_STORIES);
  });

  // it.todo("load the article when clicked");
});
