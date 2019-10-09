import { Card } from "./Card";
export declare const DESC: (a: any, b: any) => number;
export interface HandValue {
    name: string;
    value: number;
}
/**
 * Result of compareHands
 *
 * @property type   win or draw
 * @property index  winner index(if win)
 * @property name   winning hand
 * @property suit   suit name if won with hicard
 * @property value  card value if won with hicard
 */
export interface Result {
    type: 'win' | 'draw';
    index?: number;
    name?: string;
    suit?: string;
    value?: number;
}
interface TestCache {
    hicard: {
        suit: string;
        value: number;
    };
    pair: {
        value: number;
        index: number;
    };
    two_pairs: {
        all_indices: Array<number>;
        pair_indices: Array<number>;
    };
    three_of_a_kind: {
        value: number;
        indices: Array<number>;
    };
    four_of_a_kind: number;
    straight: any;
    flush: any;
    straight_flush: boolean;
}
export interface Rank {
    index: number;
    cache: TestCache;
    hand: Card[];
    name: string;
    value: number;
}
export declare class Holdem {
    private test_cache;
    private test_summary;
    private TestSeries;
    private TestHicard;
    private TestPair;
    private TestTwoPairs;
    private TestThreeOfAKind;
    private TestStraight;
    private TestFlush;
    private TestFullHouse;
    private TestFourOfAKind;
    private TestStraightFlush;
    private TestRoyalFlush;
    computeHand(allcards: Array<Card>, mainCards: Array<Card>): HandValue;
    compareHands(hands: Array<Array<Card>>, community: Array<Card>): Result;
}
export {};
