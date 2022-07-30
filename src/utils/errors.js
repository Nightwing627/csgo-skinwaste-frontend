/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */

const Errors = {
  UnknownError: -1,
  NotLoggedIn: 0,
  Maintenance: 1,
  InsufficientPrivilege: 2,
  InsufficientFunds: 3,
  Banned: 4,
  InvalidParams: 5,
  InvalidItems: 6,
  InvalidToken: 7,
  UserNotFound: 8,
  NotInWhitelist: 9,
  InternalError: 10,
  GameInProgress: 11,
  MaxItemsPlaced: 12,
  ExceedMaxBetAmount: 13,
  ChatTimeout: 14,
  InvalidRoom: 15,
  AdminLock: 16,
  UserMuted: 17,
  InvalidCommand: 18,
  InvalidUser: 19,
  CodeInUse: 20,
  Profanity: 21,
  InvalidCode: 22,
  BelowMinBet: 23,
  NotFound: 24,
  AlreadyAffiliated: 25,
  BlockDepositAddress: 26,
  NotEnoughWagered: 27,
  GameNotFound: 28,
  OutsideOfRange: 29,
  InvalidGame: 30,
  MaxGamesCreated: 31,
  MustAgreeChatRules: 32,
  SocketSpam: 33,
  ItemNotAvailable: 34,
  TradeErrorSeller: 35,
  TradeDeclined: 36,
  InvalidTradeUrl: 37,
  PendingApproval: 38,
  DepositMode: 39,
  ModMode: 40,
  AffiliateMinWithdraw: 41,
  DoesNotQualify: 42,
  InvalidCaptcha: 43,
  InvalidAmount: 44,
  PromoAlreadyRedeemed: 45,
  PromoMaxUse: 46,
  CoinPartyAlreadyActive: 47,
  CoinPartyNotActive: 48,
  UserNotEnoughBalance: 49,
  CoinPartyAlreadyJoined: 50,
  MaxBetPerRound: 51,
  InvalidOrder: 52,
  TooFast: 53,
  RewardAlreadyCollected: 54,
  RewardNotFound: 55
};

for (const entry of Object.entries(Errors)) {
  Errors[entry[1]] = entry[0];
}

export default new Proxy(Errors, {
  get(target, name) {
    return name in target
      ? target[name]
      : parseInt(name) == name
      ? "UnknownError"
      : -1;
  }
});

/**
 * Replace {} with []
 * Middle mouse select all left sides
 * insert single quote, ctrl+right arrow, insert single quote
 */

// [
//   'NotLoggedIn',
//   'Maintenance',
//   'InsufficientPrivilege',
//   'InsufficientFunds',
//   'Banned',
//   'InvalidParams',
//   'InvalidItems',
//   'InvalidToken',
//   'UserNotFound',
//   'NotInWhitelist',
//   'InternalError',
//   'GameInProgress',
//   'MaxItemsPlaced',
//   'ExceedMaxBetAmount',
//   'ChatTimeout',
//   'InvalidRoom',
//   'AdminLock',
//   'UserMuted',
//   'InvalidCommand',
//   'InvalidUser',
//   'CodeInUse',
//   'Profanity',
//   'InvalidCode',
//   'BelowMinBet',
//   'NotFound'
// ].reduce((acc, val, i) => {
//   acc[val] = i
//   return acc
// }, {})
