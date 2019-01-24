import { BigNumber, SignedOrder } from '0x.js';

export function parseJSONSignedOrder(order: string): SignedOrder {
    const signedOrder = JSON.parse(order);
    signedOrder.salt = new BigNumber(signedOrder.salt);
    signedOrder.makerAssetAmount = new BigNumber(signedOrder.makerAssetAmount);
    signedOrder.takerAssetAmount = new BigNumber(signedOrder.takerAssetAmount);
    signedOrder.makerFee = new BigNumber(signedOrder.makerFee);
    signedOrder.takerFee = new BigNumber(signedOrder.takerFee);
    signedOrder.expirationTimeSeconds = new BigNumber(signedOrder.expirationTimeSeconds);
    return signedOrder;
}
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO = new BigNumber(0);
export const networkToRPCURI = {
    1: 'https://mainnet.infura.io',
    3: 'https://ropsten.infura.io',
    4: 'https://rinkeby.infura.io',
    42: 'https://kovan.infura.io/v3/1c8e1e74645d4a149ca32efbde6cb628',
    50: 'http://localhost:8545',
};
