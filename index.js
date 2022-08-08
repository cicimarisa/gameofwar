let deckId
let playerCards = { "computer": 0, "me": 0 }
let remainingCards = 0
const remainingCardsHtml = document.getElementById("remaining-cards")
const drawCards = document.getElementById("draw-cards")

async function handleClick() {
    const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await res.json()

    deckId = data.deck_id
    remainingCards = data.remaining
    remainingCardsHtml.textContent = `Remaining cards ${remainingCards}`
    drawCards.disabled = false
}

function calcWinner(items) {
    let count = 1
    const basicScore = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    let message

    if (basicScore.indexOf(items[0].value) === basicScore.indexOf(items[1].value)) {
        message = "War!"
    } else if (basicScore.indexOf(items[0].value) > basicScore.indexOf(items[1].value)) {
        playerCards["computer"] += 1
        message = "Computer wins!"
    } else {
        playerCards["me"] += 1
        message = "You win!"
    }

    return message
}

document.getElementById("new-deck").addEventListener("click", handleClick)

drawCards.addEventListener("click", async function () {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()

    if (data.success) {
        let player1CardHtml = data.cards.map((item) => {
            return `<img src="${item.image}" alt="" class="card-img">`
        })

        const cardSlotHtml = document.getElementsByClassName("card-slot")
        cardSlotHtml[0].innerHTML = player1CardHtml[0]
        cardSlotHtml[1].innerHTML = player1CardHtml[1]
        document.getElementById("header").textContent = calcWinner(data.cards)
        document.getElementById("computer-score").textContent = playerCards["computer"]
        document.getElementById("my-score").textContent = playerCards["me"]
        remainingCards = data.remaining
        remainingCardsHtml.textContent = `Remaining cards ${remainingCards}`

        if (remainingCards === 0) {
            drawCards.disabled = true
            if (playerCards["computer"] > playerCards["me"]) {
                header.textContent = "The computer won the game!"
            } else if (playerCards["me"] > playerCards["computer"]) {
                header.textContent = "You won the game!"
            } else {
                header.textContent = "It's a tie game!"
            }
        }
    }
})