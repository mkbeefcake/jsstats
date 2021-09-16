import { JoyApi } from "../../joyApi";
import { PromiseAllObj } from "./utils";

const api = new JoyApi();

export async function getChainState() {
  await api.init;

  return await PromiseAllObj({
    finalizedBlockHeight: await api.finalizedBlockHeight(),
    validators: await api.validatorsData(),
  });
}
