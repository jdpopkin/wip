// TODO look up order
// TODO figure out where Jokers fit in
enum Suit {
    Hearts,
    Clubs,
    Spades,
    Diamonds
}

enum Value {
    Ace,
    One,
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
    1: Value.One,
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
