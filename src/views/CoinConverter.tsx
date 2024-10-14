function ConvertSlashToDash(symbol: string) {
  const [base, quote] = symbol.split('/');
  return `${quote}-${base}`;
}

function ConvertDashToSlash(symbol: string) {
  const [base, quote] = symbol.split('-');
  return `${quote}/${base}`;
}

function transformCoinData(data: Array<{ coin_name: string; code: string }>) {
  return data.map((coin) => ({
    label: coin.coin_name,
    value: ConvertDashToSlash(coin.code),
  }));
}

export { ConvertSlashToDash, ConvertDashToSlash, transformCoinData };
