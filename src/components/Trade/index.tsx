import React, { useState, useEffect } from 'react';
import { LinkBase, Box } from '@aragon/ui';

import BigNumber from 'bignumber.js';
import { getTokenBalance } from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';

import TradePageHeader from './Header';
import {ESD, UNI, USDC} from "../../constants/tokens";
import IconHeader from "../common/IconHeader";
import Icon5 from '../../icons/icon5'


function UniswapPool({ user, theme}: {user: string, theme:string}) {
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        pairBalanceESDStr, pairBalanceUSDCStr,
      ] = await Promise.all([
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalanceESD(toTokenUnitsBN(pairBalanceESDStr, ESD.decimals));
        setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals));
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
    <div style={{ position:'absolute', top: '130px', right: '15%', left: '15%'}} >
      <IconHeader theme={theme} icon={<Icon5 />} text="Trade"/>

      <TradePageHeader
        theme={theme}
        pairBalanceESD={pairBalanceESD}
        pairBalanceUSDC={pairBalanceUSDC}
        uniswapPair={UNI.addr}
      />

      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            theme={theme}
            title="Info"
            description="View DAY-DAI pool stats."
            icon={<i className="fas fa-chart-area"/>}
            href={"https://uniswap.info/pair/0x88ff79eb2bc5850f27315415da8685282c7610f9"}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
          theme={theme}
            title="Trade"
            description="Trade DAY tokens."
            icon={<i className="fas fa-exchange-alt"/>}
            href={"https://uniswap.exchange/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723"}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
          theme={theme}
            title="Supply"
            description="Supply and redeem liquidity."
            icon={<i className="fas fa-water"/>}
            href={"https://uniswap.exchange/add/0x36f3fd68e7325a35eb768f1aedaae9ea0689d723/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}
          />
        </div>
      </div>
      </div>
    </>
  );
}

type MainButtonProps = {
  title: string,
  description: string,
  icon: any,
  href:string,
  theme:string,
}


function MainButton({
  title, description, icon, href, theme
}:MainButtonProps) {
  function templatestart(){
    if (theme === 'light') return("#ffffff") ;
  
    else return("#000000")  ;
  }
  return (
    <LinkBase href={href} style={{ width: '100%' }}>
      <Box style={{ backgroundColor:templatestart(), border:templatestart()}}>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default UniswapPool;
