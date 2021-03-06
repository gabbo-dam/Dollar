import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getImplementation,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import GovernanceHeader from "./Header";
import ProposeCandidate from "./ProposeCandidate";
import CandidateHistory from "./CandidateHistory";
import IconHeader from "../common/IconHeader";
import {canPropose} from "../../utils/gov";
import Icon4 from '../../icons/icon4'

function Governance({ user, theme }: {user: string, theme:string}) {

  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [implementation, setImplementation] = useState("0x");

  useEffect(() => {
    if (user === '') {
      setStake(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [statusStr, stakeStr] = await Promise.all([
        getStatusOf(ESDS.addr, user),
        getTokenBalance(ESDS.addr, user),
      ]);

      if (!isCancelled) {
        setStake(toTokenUnitsBN(stakeStr, ESDS.decimals));
        setUserStatus(parseInt(statusStr, 10));
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

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [totalStakeStr, implementationStr] = await Promise.all([
        getTokenTotalSupply(ESDS.addr),
        getImplementation(ESDS.addr),
      ]);

      if (!isCancelled) {
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setImplementation(implementationStr)
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
      <IconHeader theme={theme} icon={<Icon4 />} text="Governance"/>

      <GovernanceHeader
      theme={theme}
        stake={stake}
        totalStake={totalStake}
        accountStatus={userStatus}
        implementation={implementation}
      />

      {
        canPropose(stake, totalStake) ?
          <>
            <Header primary="Propose Candidate"/>
            <ProposeCandidate
              theme={theme}
              user={user}
              stake={stake}
              totalStake={totalStake}
              accountStatus={userStatus}
            />
          </>
          :
          ''
      }

      <Header primary="Candidate History" />

      <CandidateHistory theme={theme} user={user}/>
      </div>
    </>
  );
}

export default Governance;
