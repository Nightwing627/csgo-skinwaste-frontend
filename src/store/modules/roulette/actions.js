import { roulette as api } from "@/api";
import { errorToast, parseJackpot } from "@/utils";
import Errors from "@/utils/errors";

function CustomError(message) {
  this.name = 'CustomError';
  this.message = message || '';
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
  this.code = Errors.InvalidParams;
}
CustomError.prototype = Object.create(Error.prototype);

export const get = async ({ commit }) => {
  try {
    const { roulette, history } = await api.get();

    commit("setRoulette", roulette);
    commit("setHistory", roulette.history);
    commit("setBets", roulette.bets);

    switch (roulette.state) {
      case "active":
        commit("setStatus", "open");
        break;
      case "betting_closed":
        commit("setStatus", "locked");
        break;
      case "rolling":
        commit("setStatus", "rolling");
        break;
      case "complete":
        commit("setStatus", "locked");
        break;
      default:
        commit("setStatus", "open");
        break;
    }
  } catch (err) {
    errorToast(err);
  }
};

export const bet = async ({ commit }, { field, bet = 0 }) => {
  try {
    if (!field || bet == 0) throw new CustomError(`${Errors.InvalidParams}`);
    // commit('setDepositLoading', true)

    const resp = await api.bet(field, bet);
    return resp;
  } catch (e) {
    errorToast(e);
    throw e.code;
  } finally {
    // commit('setDepositLoading', false)
  }
};
