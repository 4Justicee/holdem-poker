import { Deck } from "./deck";
import { Card } from "./Card";
import { Holdem, HandValue, Result } from "./Holdem";

export interface Player{
    money:number;
    hand:Array<Card>;
    folded:boolean;
    active:boolean
}
/**
 * Round represents a player's current investment and decision
 */
export interface Round{
    money:number;
    decision?:"fold"|"raise"|"call";
}
export class Game{
    private pot:number=0;
    private players:Array<Player>=[];
    private deck:Deck=new Deck();
    private table:Array<Card>=[];
    private round:Array<Round>=[];
    private __instance:Holdem=new Holdem();
    private initialBet:number;
    /**
     * Inititalizes the Game
     * 
     * @param playerMoney   Number of players will be the same length as
     * @param initialBet    Minimum amount to start with
     */
    constructor(playerMoney:Array<number>,initialBet:number){
        this.initialBet=initialBet;
        this.newRound(playerMoney);
    }
    /**
     * Starts a new game round
     * 
     * @param playerMoney Money for individual players
     */
    private newRound(playerMoney:Array<number>):void{
        this.pot=0;
        this.deck=new Deck();
        this.deck.shuffle();
        this.table=[];
        this.round=[];
        this.players=playerMoney.map((money:number)=>{
            return {
                money,
                hand:this.deck.getCards(2),
                folded:false,
                active:true
            }
        });
    }
    /**
     * Returns the array of player
     */
    getPlayers(){
        return this.players.slice(0);
    }
    /**
     * Returns the current round. This Array represents each players' current investment and decision
     */
    getRound(){
        return this.round.slice(0);
    }
    /**
     * Returns the current pot amount
     */
    getPot(){
        return this.pot;
    }
    /**
     * Returns the current community cards
     */
    getTable(){
        return this.table;
    }
    /**
     * Starts the round if not started yet
     */
    startRound():void{
        let activePlayers=0;
        for(let i=0;i<this.players.length;i++){
            if(this.players[i].money<0)
                this.players[i].active=false;
            else{
                activePlayers++;
            }
            this.round[i]={
                money:this.players[i].active?this.initialBet:0
            };
        }
        if(activePlayers==1){
            this.round=[];
            throw new Error("Game cannot continue")
        }
    }
    /**
     * Raise by a player
     * 
     * @param index Player index
     * @param money Raise amount
     */
    raise(index:number,money:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.players[index].money<money) throw new Error('Too much');
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        this.round[index].money=money;
        this.round[index].decision="raise";
    }
    /**
     * Call by a player
     * 
     * @param index Player index
     */
    call(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        this.round[index].decision="call";
    }
    /**
     * Fold by a player
     * 
     * @param index Player index
     */
    fold(index:number):void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.round[index].decision) throw new Error("Please proceed to next round");
        this.round[index].decision="fold";
        this.players[index].folded=true;
    }
    /**
     * Ends the current round.
     */
    endRound():void{
        if(!this.round.length) throw new Error("Game round not started");
        if(this.table.length>=3) throw new Error("Round is over, please invoke checkResult")
        for(let i=0;i<this.round.length;i++){
            this.pot+=this.round[i].money;
            this.round[i]={
                money:0
            }
        }
        this.table.push(this.deck.getCards(1)[0]);
    }
    /**
     * Returns the result of the current round
     */
    checkResult():Result{
        let result=this.__instance.compareHands(this.players.map(m=>m.hand),this.table);
        if(result.type=='win'){
            if(result.index!=undefined)
                this.players[result.index].money+=this.pot;
            else
                throw new Error("This error will never happen");
        }else{//draw
            //split the pot among non-folded players
            let splitCount=this.players.filter(f=>!f.folded).length;
            if(splitCount>0){
                let eachSplit=this.pot/splitCount;
                for(let i=0;i<this.players.length;i++){
                    if(!this.players[i].folded)
                        this.players[i].money+=eachSplit;
                }
            }
        }
        this.newRound(this.players.map(m=>m.money));
        return result;
    }
    /**
     * Returns the max possible hand value.
     * Note: Community cards are ignored.
     * 
     * @param hand Array of cards
     */
    computeHand(hand:Array<Card>):HandValue{
        return this.__instance.computeHand(hand,hand);
    }
}

