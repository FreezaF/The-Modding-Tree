addLayer("b", {
    name: "Bread", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#D8C4AA",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "Bread", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone('b', 1)) mult = mult.times(2)
        if(player["d"].points>=1)
            mult = mult.times(player["d"].points.pow(1.25))
        return mult
    },
    passiveGeneration() {
        num = new Decimal(0)
        if (hasUpgrade('d', 11)) num = player[this.layer].points?0.1:0
        return num
    },
    doReset(resettingLayer) {
            let keep = [];
            if (hasMilestone("d", 2) && resettingLayer=="d") keep.push("milestones")
            if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
        },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Make Slice Of Bread", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    milestones: {
        1: {
            requirementDescription: "5 Bread",
            done() { return player.b.points.gte(5) },
            effectDescription: "Bread Gain is Doubled",
        },
        2: {
            requirementDescription: "25 Bread",
            done() { return player.b.points.gte(15) },
            effectDescription: "Double point gain",
        },
        3: {
            requirementDescription: "100 Bread",
            done() { return player.b.points.gte(100) },
            effectDescription: "Bread Boosts Points",
        },
    },
})

addLayer("d", {
    name: "Ducks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#668b61",
    effectDescription() {
        return "Which are boosting Bread Gain By "+format(player["d"].points.pow(1.25))+x
    },
    canBuyMax() { return hasMilestone("d", 1) },
    branches: ["b"],
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Plumps Of Ducks", // Name of prestige currency
    baseResource: "Bread", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Capture A Duck", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Baker Ducks!",
            description: "Gain 10% of Bread Gain",
            cost: new Decimal(50),
        }
    },
    milestones: {
        1: {
            requirementDescription: "1 Duck",
            done() { return player.d.points.gte(1) },
            effectDescription: "You Can Buy Max Ducks",
        },
        2: {
            requirementDescription: "10 Duck",
            done() { return player.d.points.gte(10) },
            effectDescription: "Keep Bread Milestones On Reset",
        },
    }
})
