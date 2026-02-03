import { StakeSolButtonClient } from "./stake-sol-button-client";

type SanctumApyResponse = {
  data: Array<{
    epoch: number;
    epochEndTs: number;
    apy: number;
  }>;
};

async function fetchStakeApy(): Promise<number | null> {
  const apiKey = process.env.SANCTUM_API;

  try {
    const url = "https://sanctum-api.ironforge.network/lsts/HUBsveNpjo5pWqNkH57QzxjQASdTVXcSK7bVKTSZtcSX/apys?apiKey=" + apiKey;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
    });

    if (!res.ok) return null;
    const json = (await res.json()) as SanctumApyResponse;
    const latest = json?.data?.[0];

    return latest?.apy ?? null;
  } catch {
    return null;
  }
}

export async function StakeSolButton() {
  const apy = await fetchStakeApy();
  const apyLabel = apy != null ? `${(apy * 100).toFixed(2)}%` : null;

  return <StakeSolButtonClient apyLabel={apyLabel} />;
}
