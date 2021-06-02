const Order = require("./chatbot1Order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    SIZE: Symbol("size"),
    TOPPINGS: Symbol("toppings"),
    DRINKS: Symbol("drinks"),
    SALAD: Symbol("salad"),
    DESSERT: Symbol("dessert")
});

module.exports = class DeliOrder extends Order {
    constructor() {
        super();
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sDrinks = "";
        this.sItem = "sub";
        this.sSalad = "";
        this.sDessert = "";
        this.nCost = 0;
        this.nToppings = 0;
    }
    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Welcome to Franks Deli.");
                aReturn.push("What size would you like? (6 or 12 inch)");
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.TOPPINGS
                this.sSize = sInput;
                aReturn.push("What toppings would you like?");
                if (this.sSize.startsWith('6')) {
                    this.nCost += 7.99;
                } else if (this.sSize.startsWith('12')) {
                    this.nCost += 11.99;
                }
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.SALAD
                this.sToppings = sInput;
                this.nToppings = (this.sToppings.match(/,/g) || []).length;
                this.nToppings++;
                if (this.nToppings > 3) {
                    this.nToppings -= 3;
                    this.nCost += (this.nToppings * 0.8);
                }
                aReturn.push("Would you like a salad with your order?");
                break;
            case OrderState.SALAD:
                this.stateCur = OrderState.DESSERT
                if (sInput.toLowerCase() != "no") {
                    this.sSalad = sInput;
                    this.nCost += 3.5;
                }
                aReturn.push("Would you like dessert with your order?");
                break;
            case OrderState.DESSERT:
                this.stateCur = OrderState.DRINKS
                if (sInput.toLowerCase() != "no" || sInput.toLowerCase() == "yes") {
                    //aReturn.push("Would you like a cookie, an ice cream bar, or a popsicle?");
                    this.sDessert = sInput;
                } else this.sDessert = sInput;
                if (this.sDessert.startsWith('c') || this.sSize.startsWith('i') || this.sSize.startsWith('p')) {
                    this.nCost += 2.5;
                }
                aReturn.push("Would you like drinks with your order?");
                break;
            case OrderState.DRINKS:
                this.isDone(true);
                // if (sInput.toLowerCase() != "no") {
                //     this.sDrinks = sInput;
                // }
                if (sInput.toLowerCase() != "yes" && sInput.toLowerCase() != "no") {
                    this.sDrinks = sInput;
                    this.nCost += 1.5;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize}" ${this.sItem} with ${this.sToppings}`);
                if (this.sDrinks) {
                    aReturn.push(this.sDrinks);
                }
                if (this.sSalad) {
                    aReturn.push(this.sSalad);
                }
                if (this.sDessert) {
                    aReturn.push(this.sDessert);
                }

                aReturn.push(`The approx cost without tax is $${this.nCost}`);

                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
}