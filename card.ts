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

const stringToJokerValue = {
	a: JokerValue.A,
	A: JokerValue.A,
	b: JokerValue.B,
	B: JokerValue.B
}

const stringToValue = {
    a: Value.Ace,
    j: Value.Jack,
    q: Value.Queen,
    k: Value.King,
    2: Value.Two,
    3: Value.Three,
    4: Value.Four,
    5: Value.Five,
    6: Value.Six,
    7: Value.Seven,
    8: Value.Eight,
    9: Value.Nine,
    t: Value.Ten
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
	private raw: string;

    constructor(raw: string) {
		this.raw = raw
    }

	get value(): Value | null {
		if (this.raw.length === 1) {
			return null;
		}

		return stringToValue[this.raw[0].toLowerCase()];
	}

	get suit(): Suit | null {
		if (this.raw.length === 1) {
			return null;
		}

		let lastChar = this.raw[this.raw.length - 1];
		return stringToSuit[lastChar];
	}

	get jokerValue(): JokerValue | null {
		let lowerCase = this.raw.toLowerCase();

		if (lowerCase === "a") {
			return JokerValue.A;
		} else if (lowerCase === "b") {
			return JokerValue.B;
		} else {
			return null;
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
function updateJokerPosition(deck: Array<Card>, jokerType: JokerValue) {
    // Update big joker position
    let initialJokerIndex = deck.findIndex((card) => card.jokerValue === jokerType);
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
    if (card.jokerValue !== null) {
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

interface Result {
	key: number,
	deck: Card[]
}
function nextFromKeyStream(deck: Array<Card>): Result {
	var nextDeck: Array<Card> = deck.slice();

    // Update joker positions. Big once, little twice.
    updateJokerPosition(nextDeck, JokerValue.A);
    updateJokerPosition(nextDeck, JokerValue.B);
    updateJokerPosition(nextDeck, JokerValue.B);

    // Triple cut
    let firstJokerIndex = nextDeck.findIndex((card) => card.jokerValue != null);
    let secondJokerIndex = findNthIndex(nextDeck, 2, (card) => card.jokerValue != null);
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
    let countDown = cardValue(nextDeck[0]);
    let outputCard = nextDeck[countDown];

    // "If you hit a joker, don't write anything down and start
    // over again with step 1"
    // I'm assuming that means we can just ignore all 53s obtained from the keystream.
    let outputValue = cardValue(outputCard);
    if (outputValue < 53) {
        outputValue = outputValue % 26;
    }

    return {
        key: outputValue,
        deck: nextDeck
    };
}

function charToNumber(s) {
    return s.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1;
}
function numberToChar(n) {
	let charCode = n - 1 + "A".charCodeAt(0)
    return String.fromCharCode(charCode);
}

function crypt(text, deck, combiner) {
    const textNums = text.split("").map(charToNumber);
    let keystreamNums = [];

    let nextDeck = deck;
    while (keystreamNums.length < textNums.length) {
        let update = nextFromKeyStream(nextDeck);

        nextDeck = update.deck;
        let keystreamNum = update.key;

        if (keystreamNum < 53) {
            keystreamNums.push(keystreamNum);
        }
    }

    let resultNums = [];
    for (var i = 0; i < textNums.length; i++) {
        var nextNum = combiner(textNums[i], keystreamNums[i]) % 26;
        // 1-26, not 0-25
		nextNum = nextNum || 26;
		// Rotate numbers below zero
		if (nextNum < 0) {
			nextNum += 26;
		}

        resultNums.push(nextNum);
    }

    return resultNums.map(numberToChar).join("");
}

function encrypt(text, deck) {
    return crypt(text, deck, (a, b) => a + b);
}

function decrypt(text, deck) {
    return crypt(text, deck, (a, b) => a - b);
}

function cryptMain(text, deckText, func) {
	let deckStrings = deckText.split(/\,?\s+/);
	let deck = parseCards(deckStrings);

	return func(text, deck);
}
function encryptMain(text, deckText) {
	return cryptMain(text, deckText, encrypt);
}
function decryptMain(text, deckText) {
	return cryptMain(text, deckText, decrypt);
}
