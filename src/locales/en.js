export default {
  message: "hello i18n !!",
  game: {
    progress: {
      roundHash: "Round Hash"
    },
    history: {
      rolls: "Rolls"
    },
    bet: {
      previous: "Previous Rolls",
      header: {
        title: "Place your bets",
        bet: "Your Bet"
      },
      buttons: {
        undo: "Undo",
        tooltip: "Tip: Right click (hold on mobile) to clear all bets.",
        betAll: "Bet On All",
        repeat: "Repeat",
        double: "Double"
      },
      autorepeatActive: "Auto repeat is active.",
      pays: "pays"
    },
    entries: {
      header: {
        title: "Players this round",
        total: "Total Bet"
      },
      noBets: "No bets yet, be the first!"
    },
    toasts: {
      errors: {
        history: "Couldn't Load Game History",
        game: "Couldn't Get Game State",
        bet: "Cannot Place Bet",
        max: {
          title: "Maximum Table Limit Reached",
          text: "The sum of your bets cannot exceed {amount}."
        }
      },
      win: {
        title: "EZ Win!",
        text: "You won {amount} this round."
      }
    },
    tour: [
      {
        title: "Welcome to DinnerSpinner!",
        text:
          "Let's show you around the game so you can become a pro right away."
      },
      {
        title: "Bet Interface",
        text:
          "This is the bet interface. You use it to participate in the game."
      },
      {
        title: "Bet Chips",
        text: "First, click on a chip with a comfortable amount to bet with."
      },
      {
        title: "Fields",
        text:
          "You can now bet on as many fields as you please. Each field pays your bet times the field's number plus your bet. If you have some balance, go ahead and try it out, your bets won't be sent."
      },
      {
        title: "Undo, Double, Repeat",
        text:
          "You can bet on all fields, undo, double or repeat your bets with ease."
      },
      {
        title: "Example",
        text:
          "A little complicated? If you bet 10 credits on 5, you have the chance to win 50 + your 10 bet back. See, it's easy!"
      },
      {
        title: "Countdown & Round Info",
        text:
          "Make sure you finish all your bets before the countdown hits 0! You can also see the round status here."
      },
      {
        title: "The Wheel",
        text:
          "There it is, the wheel in all its glory. Once the countdown hits 0, it will start spinning and land on a field. Let's spin it."
      },
      {
        title: "Multiplier Rounds",
        text:
          "What are those 2x/7x fields, you ask? Your key to a potential jackpot! When a multiplier field is hit, the wheel will spin again and multiply every field by 2x/7x."
      },
      {
        title: "While the wheel is spinning..",
        text:
          "On a multiplier round, the field's payouts are multiplied by the multiplier. Since we hit 2x, this means your 50 could now turn into 100 (+ 10). Multiplier rounds can even stack, allowing for crazy jackpots."
      },
      {
        title: "That's it!",
        text:
          "You now know how DinnerSpinner works. If you have any more questions, check out the Help page!"
      },
      {
        title: "Didn't catch everything?",
        text: "You can always restart the tour here. Have fun!"
      }
    ],
    status: {
      spinning: "Spinning..",
      spinningIn: "Spinning in {num}s",
      waitingRound: "Waiting for a new round...",
      waitingBets: "Waiting for bets...",
      confirmingBets: "Confirming Bets"
    }
  },
  navbar: {
    items: {
      play: "Play",
      help: "Help",
      fair: "Fair",
      withdraw: "Withdraw"
    },
    labels: {
      balance: "Your Balance",
      volumeAll: "Overall Volume",
      volumeMusic: "The Smoothest of Jazz"
    },
    user: {
      level: "Level {num}",
      settings: "Settings",
      history: "Trade History",
      logout: "Log out"
    }
  },
  login: {
    toBet: "To play you need to Login!",
    button: "Login"
  },
  errors: {
    UnknownError: "Nani?! An error? What could this be? 🤔",
    OK: "No error",
    Fail: "This action could not be completed.",
    DatabaseError: "An internal error has occurred.",
    // 400
    Maintenance:
      "This action could not be completed because the website is in maintenance.",
    NotLoggedIn: "You need to be logged in to perform this action.",
    InsufficientPrivilege: "You do not have access to this action.",
    InsufficientFunds: "You do not have sufficient funds for this action.",
    Banned: "You are banned from completing this action.",
    InvalidParams: "Hmm, that's not gonna work.",
    InvalidItems: "The items you selected are not available or invalid.",
    InvalidToken: "Invalid session, please log out and back in again.",
    UserNotFound: "This user does not exist.",
    NotInWhitelist:
      "This action cannot be completed because you are not whitelisted.",
    // 500
    InternalError: "An internal error has occurred.",
    // 600
    GameInProgress:
      "This game is currently in progress, please enter the next one.",
    MaxItemsPlaced: "You've reached the max items limit for this game.",
    ExceedMaxBetAmount:
      "Your bet is above the maximum bet amount for this game.",
    ChatTimeout: "Please don't spam :)",
    InvalidRoom: "This chat room does not exist.",
    AdminLock: "This action is currently disabled.",
    UserMuted: "You are muted for {timeLeft} minute(s).",
    InvalidCommand: "This command does not exist.",
    InvalidUser: "This user does not exist.",
    CodeInUse: "This code either already exists or belongs to you.",
    Profanity: "Please do not use profanity.",
    InvalidCode: "This code does not exist or is invalid.",
    BelowMinBet: "Your bet is below the minimum bet amount for this game.",
    NotFound: "This action was not found.",
    AlreadyAffiliated: "You can change your referral code on {dateTillChange}.",
    BlockDepositAddress: "You cannot cashout to a deposit address.",
    NotEnoughWagered: "You need to wager {toWager} coin(s) more to cashout.",
    GameNotFound: "This game was not found.",
    OutsideOfRange: "Bet outside of range, please contact support.",
    InvalidGame: "This game is invalid.",
    MaxGamesCreated: "You've hit the max games limit.",
    MustAgreeChatRules: "Please agree to the chat rules.",
    SocketSpam: "Please do not spam.",
    ItemNotAvailable:
      "One or more items are no longer available. Please try again.",
    TradeErrorSeller: "There was an error with the trade. Please try again.",
    TradeDeclined:
      "One of the trades has been declined, you will be refunded accordingly.",
    InvalidTradeUrl: "This trade URL is not valid.",
    PendingApproval:
      "You already have a pending cashout, please wait for that one to clear.",
    DepositMode: "You need to deposit {toDeposit} coins to talk in chat.",
    ModMode: "The chat is currently in staff-only mode.",
    AffiliateMinWithdraw: "Minimum withdrawal amount is 1.00",
    DoesNotQualify: "You didnt qualify for this.",
    InvalidCaptcha: "Captha was wrongly solved.",
    InvalidAmount: "Please enter a valid amount",
    PromoAlreadyRedeemed: "The promocode was already redeemed.",
    PromoMaxUse: "Maximum uses of code reached.",
    CoinPartyAlreadyActive: "A Coinparty is already active.",
    CoinPartyNotActive: "There is no Coinparty running.",
    UserNotEnoughBalance: "You need more balance to do this.",
    CoinPartyAlreadyJoined: "You already joined the Coinparty.",
    MaxBetPerRound: "You cannot bet more than this.",
    InvalidOrder: "Your order could not be fulfilled.",
    TooFast: "Slow down there, buckaraoo.",
    RewardAlreadyCollected: "You have already collected the daily reward for today.",
    RewardNotFound: "Rewards are currently unavailable.",
  }
};
