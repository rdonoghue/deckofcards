# RPG/Divination Deckbuilder

Web page for displaying and manipulating cards for RPGs and similar.

## Purpose

This is a pure javascript site - no backend or databases - because the intent is to be friendly to a less technical audience who just wants this to run anywhere, including locally.

## TODO

- Add a media query so narrower screens don't cause Wheel of Fortune to overflow the box
  - Maybe trigger the card resizing on screen size too?
- Write up instructions and guidance, espcially re card-size
- See about fragmenting the code up a bit - currently it's just a big monolith
- Maybe see if I can put things liek card size in a config fil
- Replace some of the uglier arcana. Hanged Man, I'm looking at you
- Replace the clunky buttons up top with some actually useful icons.

## Someday

- Multiple views on a single page
- This doesn't really work on phones, but that's largely because I can't imagine what it SHOULD look like on phones. I can imagine other functionality (flipping through a deck one at a time or drawing a card) but that's a different kind of interface entirely. Would it be worth adding a phone view, or shoudl I just consider that a differentarrangement?
