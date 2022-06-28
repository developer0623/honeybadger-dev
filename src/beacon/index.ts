import {FunctionComponent} from 'react';

import General from './templates/General';
import DexterEthtzPool from './templates/DexterEthtzPool';
import DexterUsdtzPool from './templates/DexterUsdtzPool';
import DexterWxtzPool from './templates/DexterWxtzPool';
import DexterTzbtcPool from './templates/DexterTzbtcPool';
import EthtzToken from './templates/EthtzToken';
import UsdtzToken from './templates/UsdtzToken';
import WxtzToken from './templates/WxtzToken';
import TzbtcToken from './templates/TzbtcToken';

enum ContractTypes {
    DEXTER_ETHTZ_POOL = 'KT19c8n5mWrqpxMcR3J687yssHxotj88nGhZ',
    DEXTER_USDTZ_POOL = 'KT1Puc9St8wdNoGtLiD2WXaHbWU7styaxYhD',
    DEXTER_WXTZ_POOL = 'KT1XTXBsEauzcv3uPvVXW92mVqrx99UGsb9T',
    DEXTER_TZBTC_POOL = 'KT1DrJV8vhkdLEj76h1H9Q4irZDqAkMPo1Qf',
    ETHTZ_TOKEN = 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
    USDTZ_TOKEN = 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    WXTZ_TOKEN = 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH',
    TZBTC_TOKEN = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
}

const templates: Record<string, FunctionComponent<{navigation: any}>> = {
    general: General,
    dexter_ethtz_pool: DexterEthtzPool,
    dexter_usdtz_pool: DexterUsdtzPool,
    dexter_wxtz_pool: DexterWxtzPool,
    dexter_tzbtc_pool: DexterTzbtcPool,
    ethtz_token: EthtzToken,
    usdtz_token: UsdtzToken,
    wxtz_token: WxtzToken,
    tzbtc_toke: TzbtcToken,
};

const getBeaconTemplate = (id: string = '') => {
    switch (true) {
        case id === ContractTypes.DEXTER_ETHTZ_POOL:
            return templates['dexter_ethtz_pool'];
        case id === ContractTypes.DEXTER_USDTZ_POOL:
            return templates['dexter_usdtz_pool'];
        case id === ContractTypes.DEXTER_WXTZ_POOL:
            return templates['dexter_wxtz_pool'];
        case id === ContractTypes.DEXTER_TZBTC_POOL:
            return templates['dexter_tzbtc_pool'];
        case id === ContractTypes.ETHTZ_TOKEN:
            return templates['ethtz_token'];
        case id === ContractTypes.USDTZ_TOKEN:
            return templates['usdtz_token'];
        case id === ContractTypes.WXTZ_TOKEN:
            return templates['wxtz_token'];
        case id === ContractTypes.TZBTC_TOKEN:
            return templates['tzbtc_token'];
        default:
            return templates['general'];
    }
};

export default getBeaconTemplate;
