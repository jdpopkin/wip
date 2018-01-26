// TODO look up order
// TODO figure out where Jokers fit in
enum Suit {
    Hearts,
    Clubs,
    Spades,
    Diamonds
}

enum Value {
    Ace = 1,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
}

enum JokerValue {
    A,
    B
}

const stringToValue = {
    a: Value.Ace,
    j: Value.Jack,
    q: Value.Queen,
    k: Value.King,
    //1: Value.One,
    2: Value.Two,
    3: Value.Three,
    4: Value.Four,
    5: Value.Five,
    6: Value.Six,
    7: Value.Seven,
    8: Value.Eight,
    9: Value.Nine,
    0: Value.Ten
}

const stringToSuit = {
    h: Suit.Hearts,
    "♥": Suit.Hearts,
    c: Suit.Clubs,
    "♣": Suit.Clubs,
    s: Suit.Spades,
    "♠": Suit.Spades,
    d: Suit.Diamonds,
    "♦": Suit.Diamonds
}

class Card {
    suit: Suit | null;
    value: Value | null;
    jokerValue: JokerValue | null;

    constructor(raw: string) {
        if (raw.toLowerCase() === "a") {
            this.jokerValue = JokerValue.A;
        } else if (raw.toLowerCase() === "b") {
            this.jokerValue = JokerValue.B;
        } else {
            this.value = stringToValue[raw[0]];
            this.suit = stringToSuit[raw[1]];
        }
    }
}

function parseCards(cards: Array<string>): Array<Card> {
    return cards.map((c) => new Card(c));
}

function isValidCard(card: String): boolean {
    const lower = card.toLowerCase();
    return lower === "a" || lower === "b" || /^[atjkq2-9][cdhs♣♦♥♠]$/.test(lower);
}
function validateDeck(input: String): boolean {
    const cards = input.split(/\s+/);
    // TODO validate each card is distinct?
    return cards.length === 54 && cards.every(isValidCard);
}

function swap(deck: Array<Card>, a: number, b: number) {
    const aVal = deck[a];
    deck[a] = deck[b];
    deck[b] = aVal;
}
function updateJokerPosition(deck: Array<card>, jokerType: string) {
    // Update big joker position
    let initialJokerIndex = deck.findIndex((card) => card.jokeValue === jokerType);
    if (initialJokerIndex === deck.length) {
        // Move joker from back to just below front
        const joker = deck.pop();
        deck.splice(1, 0, joker);
    } else {
        // Swap with one below
        swap(deck, initialJokerIndex, initialJokerIndex + 1);
    }
}

function findNthIndex(arr, n, func) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        if (func(arr[i])) {
            count++;
        }

        if (count === n) {
            return i;
        }
    }

    return -1;
}

function cardValue(card: Card): number {
    if (card.jokerValue) {
        return 53;
    }

    var suitValue;
    if (card.suit === Suit.Clubs) {
        suitValue = 0;
    } else if (card.suit === Suit.Diamonds) {
        suitValue = 13;
    } else if (card.suit === Suit.Hearts) {
        suitValue = 26
    } else {
        suitValue = 39;
    }

    var numericValue = card.value;

    return suitValue + numericValue;
}

// Actually, return an object?
function nextFromKeyStream(deck: Array<Card>): number {
    var nextDeck = deck.slice();

    // Update joker positions. Big once, little twice.
    updateJokerPosition(nextDeck, "a");
    updateJokerPosition(nextDeck, "b");
    updateJokerPosition(nextDeck, "b");

    // Triple cut
    // Extract this function?
    // Definitely extract Card.isJoker
    let firstJokerIndex = nextDeck.findIndex((card) => card.jokeValue != null);
    let secondJokerIndex = findNthIndex(nextDeck, 2, (card) => card.jokeValue != null);
    const deckTop = nextDeck.slice(0, firstJokerIndex);
    const deckMiddle = nextDeck.slice(firstJokerIndex, secondJokerIndex + 1);
    const deckBottom = nextDeck.slice(secondJokerIndex + 1);
    nextDeck = deckBottom.concat(deckMiddle).concat(deckTop);

    // Count cut
    let bottomCard = nextDeck[nextDeck.length - 1];
    let value = cardValue(bottomCard);
    let deckTop2 = nextDeck.slice(0, value);
    let deckMiddle2 = nextDeck.slice(value, nextDeck.length - 1);
    let deckBottom2 = nextDeck.slice(nextDeck.length - 1);
    nextDeck = deckMiddle2.concat(deckTop2).concat(deckBottom2);

    // Find output card
    // "If you hit a joker, don't write anything down and start
    // over again with step 1" - ?????
}
